const { config } = require("../config/env");

class MockApiError extends Error {
  constructor() {
    super("The local mock data API request failed.");
    this.status = 503;
  }
}

async function request(pathname, options = {}) {
  let response;

  try {
    response = await fetch(`${config.mockApiUrl}${pathname}`, {
      ...options,
      headers: {
        "content-type": "application/json",
        "x-mock-api-key": config.mockApiKey,
        ...options.headers,
      },
    });
  } catch {
    throw new MockApiError();
  }

  if (!response.ok) {
    throw new MockApiError();
  }

  return response.json();
}

async function findAll() {
  const posts = await request("/posts");
  return posts.sort((first, second) => {
    const firstDate = Date.parse(first.createdAt || "") || 0;
    const secondDate = Date.parse(second.createdAt || "") || 0;
    return secondDate - firstDate || Number(second.id) - Number(first.id);
  });
}

async function findById(id) {
  let response;

  try {
    response = await fetch(`${config.mockApiUrl}/posts/${encodeURIComponent(id)}`, {
      headers: { "x-mock-api-key": config.mockApiKey },
    });
  } catch {
    throw new MockApiError();
  }

  if (response.status === 404) return null;
  if (!response.ok) throw new MockApiError();
  return response.json();
}

function create(post) {
  return request("/posts", {
    method: "POST",
    body: JSON.stringify(post),
  });
}

function updateVisibility(id, isPublished) {
  return request(`/posts/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ isPublished }),
  });
}

module.exports = { create, findAll, findById, updateVisibility };

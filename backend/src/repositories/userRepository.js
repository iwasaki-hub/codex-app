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

async function findByEmail(email) {
  const users = await request(`/users?email=${encodeURIComponent(email)}`);
  return users[0] || null;
}

async function findById(id) {
  const response = await fetch(`${config.mockApiUrl}/users/${encodeURIComponent(id)}`, {
    headers: { "x-mock-api-key": config.mockApiKey },
  }).catch(() => {
    throw new MockApiError();
  });

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new MockApiError();
  }

  return response.json();
}

function create(user) {
  return request("/users", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

module.exports = { create, findByEmail, findById };

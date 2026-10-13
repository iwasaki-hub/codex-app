const postRepository = require("../repositories/postRepository");
const userRepository = require("../repositories/userRepository");

async function list(request, response) {
  const posts = (await postRepository.findAll()).filter((post) => (
    post.isPublished !== false || String(post.authorId) === request.auth?.userId
  ));
  response.json({ posts });
}

async function create(request, response) {
  const author = await userRepository.findById(request.auth.userId);
  if (!author) {
    return response.status(401).json({ message: "ユーザーが見つかりません。再度ログインしてください。" });
  }

  const post = await postRepository.create({
    title: request.body.title,
    content: request.body.content,
    authorId: String(author.id),
    authorName: author.name,
    isPublished: request.body.isPublished !== false,
    createdAt: new Date().toISOString(),
  });

  response.status(201).json({ post });
}

async function updateVisibility(request, response) {
  const post = await postRepository.findById(request.params.id);
  if (!post) {
    return response.status(404).json({ message: "記事が見つかりません。" });
  }
  if (String(post.authorId) !== request.auth.userId) {
    return response.status(403).json({ message: "この記事の公開状態を変更する権限がありません。" });
  }

  const updatedPost = await postRepository.updateVisibility(
    request.params.id,
    request.body.isPublished,
  );
  response.json({ post: updatedPost });
}

module.exports = { create, list, updateVisibility };

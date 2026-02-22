export function setupWallFeedInteractions(root) {
  for (const likeButton of root.querySelectorAll(".action-like")) {
    likeButton.addEventListener("click", () => {
      const postId = likeButton.getAttribute("data-like-for");
      const countNode = postId ? root.querySelector(`[data-like-count="${postId}"]`) : null;
      const value = Number.parseInt(countNode?.textContent ?? "0", 10);
      if (countNode) {
        countNode.textContent = String(Number.isNaN(value) ? 1 : value + 1);
      }
    });
  }

  for (const replyButton of root.querySelectorAll(".action-reply")) {
    replyButton.addEventListener("click", () => {
      const postId = replyButton.getAttribute("data-reply-for");
      const form = postId ? root.querySelector(`[data-reply-form="${postId}"]`) : null;
      if (form) {
        const hidden = form.hasAttribute("hidden");
        if (hidden) {
          form.removeAttribute("hidden");
        } else {
          form.setAttribute("hidden", "");
        }
      }
    });
  }
}

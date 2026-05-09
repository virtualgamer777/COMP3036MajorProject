"use client";

//import { Router } from "next/router";
import { useState } from "react";

type Props = {
  postId: number;
  initialLikes: number;
  initiallyLiked: boolean;
};

export default function LikeButton({ postId, initialLikes, initiallyLiked }: Props) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initiallyLiked);

  const onLike = async () => {
	const res = await fetch("/api/like", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({ postId }),
	});
	if (!res.ok) return;
	window.location.reload();
  };


  return (
    <button data-test-id="like-button"
      type="button"
      onClick={onLike}
      className={liked ? "text-pink-700 font-semibold" : "text-primary"}
    >
      {likes} Likes
    </button>
  );
}
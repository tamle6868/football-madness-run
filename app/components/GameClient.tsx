"use client";

import { useEffect, useRef } from "react";

export default function GameClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<unknown>(null);

  useEffect(() => {
    if (gameRef.current || !containerRef.current) return;

    let cancelled = false;
    let game: { destroy: (removeCanvas: boolean) => void } | null = null;

    (async () => {
      const { createGame } = await import("../game");
      if (cancelled || !containerRef.current) return;
      game = createGame(containerRef.current);
      gameRef.current = game;
    })();

    return () => {
      cancelled = true;
      if (game) {
        game.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div id="game-root" ref={containerRef} />;
}

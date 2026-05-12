import GameClient from "./components/GameClient";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <GameClient />
      <div id="rotate-overlay" aria-hidden="true">
        <svg
          className="icon"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="14"
            y="6"
            width="36"
            height="52"
            rx="6"
            ry="6"
            stroke="#ffd23a"
            strokeWidth="3"
          />
          <rect x="28" y="50" width="8" height="3" rx="1" fill="#ffd23a" />
          <path
            d="M52 28 a18 18 0 0 1 -18 18"
            stroke="#32d264"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M50 22 L52 28 L46 30"
            stroke="#32d264"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h2>Vui lòng xoay ngang điện thoại</h2>
        <p>
          Football Madness Run chơi tốt nhất ở chế độ ngang. Hãy xoay máy để
          bắt đầu!
        </p>
      </div>
    </main>
  );
}

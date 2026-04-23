import { createSignal, Show } from "solid-js";

function App() {
  const [rejected, setRejected] = createSignal(false);

  return (
    <main>
      <h1>人類専用マッチングアプリ</h1>
      <Show
        when={rejected()}
        fallback={
          <>
            <p>あなたは人類ですか？</p>
            <button type="button" onClick={() => alert("ようこそ、人類の方。")}>
              はい
            </button>
            <button type="button" onClick={() => setRejected(true)}>
              いいえ
            </button>
          </>
        }
      >
        <p>人類以外は利用することができません。</p>
        <button type="button" onClick={() => setRejected(false)}>
          最初に戻る
        </button>
      </Show>
      <hr />
      <footer>
        <p>
          inspired by{" "}
          <a href="https://uec-matching.mimifuwacc.workers.dev/" target="_blank" rel="noreferrer">
            https://uec-matching.mimifuwacc.workers.dev/
          </a>
        </p>
        <p>© 2026 imaimai17468</p>
      </footer>
    </main>
  );
}

export default App;

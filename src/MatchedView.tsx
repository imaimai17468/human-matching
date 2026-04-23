import { createMemo, createSignal, For } from "solid-js";
import { profile } from "./profile.ts";
import { averageRowHeight } from "./row-height.ts";

const HUMAN_POPULATION = 8_184_437_460;
const LIST_WIDTH = 600;
const LIST_HEIGHT = 480;
const TEXT_WIDTH = LIST_WIDTH - 32;
const OVERSCAN = 3;

const ROW_HEIGHT = averageRowHeight(TEXT_WIDTH);
const MAX_VIRTUAL_TOP = HUMAN_POPULATION * ROW_HEIGHT - LIST_HEIGHT;
const VISIBLE_COUNT = Math.ceil(LIST_HEIGHT / ROW_HEIGHT) + OVERSCAN * 2;

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function MatchedView() {
  const [virtualTop, setVirtualTop] = createSignal(0);

  const firstIndex = createMemo(() =>
    Math.max(0, Math.floor(virtualTop() / ROW_HEIGHT) - OVERSCAN),
  );
  const shiftY = createMemo(() => firstIndex() * ROW_HEIGHT - virtualTop());
  const indices = createMemo(() => {
    const start = firstIndex();
    const count = Math.min(VISIBLE_COUNT, HUMAN_POPULATION - start);
    return Array.from({ length: count }, (_, i) => start + i);
  });

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    setVirtualTop((t) => clamp(t + e.deltaY, 0, MAX_VIRTUAL_TOP));
  };

  let touchY: number | null = null;
  const onTouchStart = (e: TouchEvent) => {
    touchY = e.touches[0]?.clientY ?? null;
  };
  const onTouchMove = (e: TouchEvent) => {
    const y = e.touches[0]?.clientY;
    if (y == null || touchY == null) return;
    e.preventDefault();
    setVirtualTop((t) => clamp(t + (touchY! - y), 0, MAX_VIRTUAL_TOP));
    touchY = y;
  };

  return (
    <>
      <p>{HUMAN_POPULATION.toLocaleString("ja-JP")}人の人類とマッチングしました。</p>
      <div
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        style={{
          height: `${LIST_HEIGHT}px`,
          width: `${LIST_WIDTH}px`,
          overflow: "hidden",
          border: "1px solid #888",
          position: "relative",
          "touch-action": "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `${shiftY()}px`,
            left: 0,
            right: 0,
          }}
        >
          <For each={indices()}>
            {(index) => {
              const p = profile(index);
              return (
                <div
                  style={{
                    height: `${ROW_HEIGHT}px`,
                    padding: "12px 16px",
                    "box-sizing": "border-box",
                    "border-bottom": "1px solid #ddd",
                    overflow: "hidden",
                    "font-weight": "700",
                    "font-size": "16px",
                    "line-height": "24px",
                  }}
                >
                  #{p.id.toLocaleString("ja-JP")} {p.name}（{p.age}歳）
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </>
  );
}

export default MatchedView;

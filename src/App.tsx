import * as React from "react";
import "./styles.css";

// @ts-ignore
import confetti from "canvas-confetti";

type SplitbeeCountState<T extends string> = { [key in T]: number };

const useSplitbeeCount = <T extends string>(
  events: T | Array<T>
): SplitbeeCountState<T> => {
  const [data, setData] = React.useState<SplitbeeCountState<T>>({} as any);
  const socket = React.useRef(new WebSocket("wss://api.splitbee.io/public"));
  const isSingle = typeof events === "string";
  React.useEffect(() => {
    socket.current.onopen = (e) => {
      socket.current.send(
        JSON.stringify({
          type: "subscribe",
          data: {
            projectId: "037d67e384",
            events: isSingle ? [events] : events
          }
        })
      );
    };
    socket.current.onmessage = (e) => {
      const d = JSON.parse(e.data);
      setData((dd) => ({ ...dd, [d.event]: d.count }));
    };

    return () => {};
  }, []);

  return isSingle ? (data as any)[events] : data;
};

console.log("ret");

export default function App() {
  const toasts = useSplitbeeCount("Trigger Toast");

  React.useEffect(() => {
    confetti({
      particleCount: 50,
      startVelocity: 20,
      spread: 360,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      }
    });
  }, [toasts]);

  return (
    <div className="App">
      <h1>Toasts Fired</h1>
      <h1>{toasts}</h1>
    </div>
  );
}

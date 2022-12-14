import styles from "./styles.module.css";
import React, { useState } from "react";
import { WindowInstance } from "../../types/window-instance";
import Draggable from "react-draggable";
import { Button } from "../button";
import { useWindowsStore } from "../../stores/windows";

export function WindowComponent({ instance }: { instance: WindowInstance }) {
  const { destroyWindow } = useWindowsStore();
  const [ position, setPosition ] = useState({ x: instance.initialX, y: instance.initialY });

  return <div style={{ position: 'fixed', left: 0, top: 0, width: 0, height: 0 }}>
    <Draggable position={position} onDrag={(e, data) => setPosition({x: data.x, y: data.y})} handle={'.' + styles.bar}>
      <div className={styles.container}>
        <div className={styles.bar}>
          <span>{instance.title}</span>
          <Button onClick={() => destroyWindow(instance.name)} className={styles.closeBtn} type='secondary'>X</Button>
        </div>
        <div className={styles.content}>{instance.elem}</div>
      </div>
    </Draggable>
  </div>
}

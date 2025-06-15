import { useState } from "react";
import styles from "../styles/flipInfoCardCmpnt.module.css";

interface FlipInfoCardProp {
  title: string;
  paras: string[];
}

const FlipInfoCard = ({ title, paras }: FlipInfoCardProp) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={styles["flip-info-card"]}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`${styles["flip-info-card-inner"]} ${
          flipped ? styles.flipped : ""
        }`}
      >
        <div className={styles["flip-info-card-front"]}>
          <h6>{title}</h6>
          <small>Click to read more</small>
        </div>
        <div className={styles["flip-info-card-back"]}>
          {paras.map((para, index) => (
            <p key={index}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlipInfoCard;

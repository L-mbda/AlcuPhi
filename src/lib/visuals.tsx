import * as motion from "motion/react-client";
import Image from "next/image";

export function WavingHand({
  size = 32,
  waveAngle = -10,
  waveDuration = 0.5,
}: {
  size?: number;
  waveAngle?: number;
  waveDuration?: number;
}) {
  return (
    <motion.div
      style={{ display: "inline-block", width: size, height: size }}
      initial={{ rotate: waveAngle }}
      animate={{ rotate: [waveAngle, waveAngle * 4, -2*waveAngle, 2*waveAngle] }}
      transition={{
        duration: waveDuration * 4,
        ease: "easeInOut",
        repeat: 0,
      }}
      className="mb-5"
    >
      <Image src="/hand.png" width={size} height={size} alt="Waving Hand" />
    </motion.div>
  );
}
import splashscreen from "@/lib/visuals/splashscreen.json" assert { type: "json" };

/*
  Splash screen, or eye candy
*/
export function SplashScreen() {
  const data =
    splashscreen.splashes[
      Math.trunc(Math.random() * splashscreen.splashes.length)
    ];
  return (
    <p>
      <i>{data}</i>
    </p>
  );
}
import styles from "./style.css";

export default function notesWidget(id: string) {
  console.log("notes widget!");

  const $entry = document.getElementById(id);
  $entry.classList.add(styles.example);
}

import { useState } from "react";

export default function TextInput({ onSubmit }) {
  const [text, setText] = useState('');

  return (
    <>
      <p>Split your search using commas. For example, if you want your playlist to have two songs and "read" as "Oh well there's nothing we can do", then type "Oh well, there's nothing we can do"</p>
      <form className="input-group mb-3">
        <input
          type="text" className="form-control"
          placeholder="Enter your text here"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <button
          className="btn btn-secondary" type="button"
          onClick={() => onSubmit(text)}
        >Search</button>
      </form>
    </>
  )
}
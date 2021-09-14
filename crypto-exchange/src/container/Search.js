import { useState } from "react";

const Search = ({ search }) => {
  const [text, setText] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    if (!text) {
      alert("Empty Search");
      return;
    }
    search(text);
    setText("");
  };

  return (
    <form className="add-form" onSubmit={onSubmit}>
      <div className="form-control">
        <label>Search</label>
        <input
          type="text"
          placeholder="Type name or type all to see All"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></input>
      </div>
      <input className="btn btn-block" type="submit" value="Search"></input>
    </form>
  );
};

export default Search;

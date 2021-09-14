const Header = ({ resetSearch }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    resetSearch();
  };
  return (
    <div className="top" onClick={onSubmit}>
      <h1 className="title">Tegger Crypto Exchange</h1>
    </div>
  );
};
export default Header;

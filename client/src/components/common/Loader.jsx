/** Simple centered spinner used while data is being fetched. */
const Loader = ({ label = "Loading..." }) => (
  <div className="loader-wrap">
    <div className="spinner" />
    <span>{label}</span>
  </div>
);

export default Loader;

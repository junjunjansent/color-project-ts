import { CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <>
      <div
        style={{ padding: "1rem", display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </div>
    </>
  );
};

export default Loader;

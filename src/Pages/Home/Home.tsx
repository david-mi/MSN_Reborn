import { useAppDispatch } from "@/redux/hooks";
import { disconnectMiddleware } from "@/redux/slices/user/user";

function Home() {
  const dispatch = useAppDispatch()

  function handleClick() {
    dispatch(disconnectMiddleware())
  }

  return (
    <div data-testid="home">
      <h1>Home</h1>
      <button onClick={handleClick}>Se déconnecter</button>
    </div>
  );
}

export default Home;
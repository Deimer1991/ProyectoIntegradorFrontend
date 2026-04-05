import { ThemeProvider } from "./context/ThemeContext";
import AppRouter from "./router/AppRouter";


const App = () => {
  return (

    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
    
  )
}

export default App;

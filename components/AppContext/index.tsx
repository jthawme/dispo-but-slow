import { createContext, useContext, useEffect, useState } from "react";

interface AppContextProps {
  loading: boolean;
  pageState: PageState;
  setPageState: (state: PageState) => void;
  photos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
}

export enum PageState {
  Intro,
  Main,
  Develop,
}

const AppContext = createContext<AppContextProps>({
  loading: false,
  pageState: PageState.Intro,
  setPageState: () => false,
  photos: [],
  setPhotos: () => false,
});

const AppContainer: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [pageState, setPageState] = useState<PageState>(PageState.Intro);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    document.documentElement.classList.add("transition");
  });

  return (
    <AppContext.Provider
      value={{
        loading,
        pageState,
        setPageState,
        photos,
        setPhotos,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

export { AppContainer, useApp };

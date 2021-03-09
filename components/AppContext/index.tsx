import { createContext, useContext, useEffect, useState } from "react";

interface AppContextProps {
  loading: boolean;
  pageState: PageState;
  setPageState: (state: PageState) => void;
  photos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  aboutOpen: boolean;
  setAboutOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  aboutOpen: false,
  setAboutOpen: () => false,
});

const AppContainer: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [pageState, setPageState] = useState<PageState>(PageState.Intro);
  const [photos, setPhotos] = useState<string[]>([]);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);

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
        aboutOpen,
        setAboutOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

export { AppContainer, useApp };

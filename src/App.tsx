import React, { useState } from "react";
import Header from "./components/header/header";
import Home from "./pages/home/home";
import Footer from "./components/footer/footer";
import "./App.css";

const App = () => {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterMember, setFilterMember] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"timestamp" | "title">("timestamp");

  return (
    <div className="app">
      <Header
        onFilterCategory={(category) => setFilterCategory(category)}
        onFilterMember={(member) => setFilterMember(member)}
        onSort={(sortBy) => setSortBy(sortBy)} 
      />
      <Home filterCategory={filterCategory} filterMember={filterMember} sortBy={sortBy} />
      <Footer />
    </div>
  );
};

export default App;
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";
import ProductCard from "../components/ProductCard";
import CrazyLoader from "../components/CrazyLoader";
import CustomProductCard from "../components/CustomProductCard"; // ✅

const categories = ["All", "Fruits", "Vegetables", "Dairy", "Snacks", "Beverages"];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (category !== "All") {
      filtered = filtered.filter(
        (product) => product.category?.toLowerCase() === category.toLowerCase()
      );
    }
    if (search.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [search, category, products]);

  return (
    <div className="w-full">
      <Navbar />
      <Slider />
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <SearchBar search={search} setSearch={setSearch} />
        <Categories
          category={category}
          setCategory={setCategory}
          categories={categories}
        />

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-8 mb-4 text-center text-[#319795]">
          Our Products
        </h2>

        {loading ? (
          <CrazyLoader />
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* ✅ Custom Product Request Card */}
        <div className="mt-10 mb-20">
          <CustomProductCard />
        </div>
      </div>
    </div>
  );
};

export default Home;

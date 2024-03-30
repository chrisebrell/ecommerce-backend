import { useEffect, useState } from "react";
import Layout from "./components/layout";
import axios from "axios";
import { Settings } from "models/Setting";
import { withSwal } from "react-sweetalert2";

function SettingsPage({ swal }) {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [featuredProductId, setFeaturedProductId] = useState("");
  const [featuredLoading, setFeaturedLoading] = useState(false);

  useEffect(() => {
    axios.get("/api/products").then((res) => {
      setProducts(res.data);
      setProductsLoading(false);
    });
    axios.get("/api/settings?name=featuredProductId").then((res) => {
      setFeaturedProductId(res.data.value);
      setFeaturedLoading(false);
    });
  }, []);

  async function saveSettings({}) {
    await axios
      .put("/api/settings", {
        name: "featuredProductId",
        value: featuredProductId,
      })
      .then(() => {
        swal.fire({
          icon: "success",
          title: "Featured Product Updated!",
          confirmButtonColor: "#3085d6",
        });
      });
  }

  return (
    <Layout>
      <h1>Settings</h1>

      {!productsLoading && !featuredLoading && (
        <>
          <label>Featured Product</label>
          <select
            value={featuredProductId}
            onChange={(ev) => setFeaturedProductId(ev.target.value)}
          >
            {products.length > 0 &&
              products.map((product) => (
                <option value={product._id}>{product.title}</option>
              ))}
          </select>
          <div>
            <button onClick={saveSettings} className="btn-red">
              SAVE
            </button>
          </div>
        </>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }) => <SettingsPage swal={swal} />);

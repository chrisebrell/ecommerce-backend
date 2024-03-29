import { useRouter } from "next/router";
import Layout from "pages/components/layout";
import { useEffect } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import { useState } from "react";
import Products from "pages/products";

function DeleteProductPage({ swal }) {
  const router = useRouter();
  const { id } = router.query;
  const [productInfo, setProductInfo] = useState();

  useEffect(() => {
    if (!id) return;

    const fetchProductInfo = async () => {
      try {
        const response = await axios.get("/api/products?id=" + id);
        setProductInfo(response.data);

        await swal
          .fire({
            icon: "warning",
            title: "Are you sure?",
            text: `Are you sure you want to delete ${response.data.title}? This action cannot be undone.`,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Yes",
            confirmButtonColor: "#d33",
            reverseButtons: true,
          })
          .then(async (result) => {
            if (result.isConfirmed) {
              await axios.delete("/api/products?id=" + id);
              // await swal.fire({
              //   icon: "success",
              //   title: "Deleted!",
              //   text: `${response.data.title} has been deleted.`,
              //   confirmButtonColor: "#3085d6",
              // });
              router.push("/products");
            } else if (result.dismiss === swal.DismissReason.cancel) {
              router.push("/products");
            }
          });
      } catch (error) {
        console.error("Error fetching product info:", error);
        // Handle error
      }
    };

    fetchProductInfo();
  }, [id, router, swal]);

  return <Products />;
}

export default withSwal(DeleteProductPage);

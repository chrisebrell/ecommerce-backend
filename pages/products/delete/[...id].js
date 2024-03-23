import { useRouter } from "next/router";
import Layout from "pages/components/layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function DeleteProductPage({ swal }) {
  const router = useRouter();
  const { id } = router.query;
  const [productInfo, setProductInfo] = useState();

  useEffect(() => {
    if (!id) return;

    const fetchProductInfo = async () => {
      const response = await axios.get("/api/products?id=" + id);
      setProductInfo(response.data);

      swal
        .fire({
          // title: "Are you sure?",
          text: `Are you sure you want to delete ${response.data.title}?`,
          showCancelButton: true,
          cancelButtonText: "Cancel",
          confirmButtonText: "Yes",
          confirmButtonColor: "#d33",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            await axios.delete("/api/products?id=" + id);
            swal
              .fire(
                "Deleted!",
                `${response.data.title} has been deleted.`,
                "success"
              )
              .then(() => {
                router.push("/products");
              });
          } else if (result.dismiss === swal.DismissReason.cancel) {
            router.push("/products");
          }
        });
    };

    fetchProductInfo();
  }, [id, router, swal]);

  return (
    <Layout>
      {/* <h1 className="text-center">Deleting product...</h1> */}
    </Layout>
  );
}

export default withSwal(DeleteProductPage);

// import { useRouter } from "next/router";
// import Layout from "pages/components/layout";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function DeleteProductPage() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [productInfo, setProductInfo] = useState();

//   useEffect(() => {
//     if (!id) {
//       return;
//     }
//     axios.get("/api/products?id=" + id).then((response) => {
//       setProductInfo(response.data);
//     });
//   }, [id]);

//   function goBack() {
//     router.push("/products");
//   }

//   async function deleteProduct() {
//     await axios.delete("/api/products?id=" + id);
//     goBack();
//   }
//   return (
//     <Layout>
//       <h1 className="text-center">
//         Are you sure you want to delete <b>{productInfo?.title}</b>?
//       </h1>
//       <div className="flex gap-2 justify-center">
//         <button className="btn-red" onClick={deleteProduct}>
//           Yes
//         </button>
//         <button className="btn-default" onClick={goBack}>
//           No
//         </button>
//       </div>
//     </Layout>
//   );
// }

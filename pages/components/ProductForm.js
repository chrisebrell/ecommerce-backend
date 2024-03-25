import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Loading from "./Loading";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  images: existingImages,
  price: existingPrice,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(assignedCategory || "");
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();

    // Check if category is not empty, if it is, set it to null
    const categoryToSend = category ? category : null;

    const data = {
      title,
      description,
      price,
      images,
      category: categoryToSend,
      properties: productProperties,
    };

    if (_id) {
      //update
      await axios.put("/api/products", { ...data, _id });
      setGoToProducts(true);
    } else {
      //create
      await axios.post("/api/products", data);
      setGoToProducts(true);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }

  //update state of prod props
  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  //images uplaod function
  async function uploadImages(ev) {
    //upload
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  //assign all properties for parent and child categories, run while loop for all structure
  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    if (catInfo) {
      propertiesToFill.push(...catInfo.properties);
      while (catInfo?.parent?._id) {
        const parentCat = categories.find(
          ({ _id }) => _id === catInfo.parent._id
        );
        if (parentCat) {
          propertiesToFill.push(...parentCat.properties);
          catInfo = parentCat;
        } else {
          break;
        }
      }
    }
  }

  //show on page
  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="Product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>

      {/* display properties */}
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={p.name} className="">
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

      <label>Product Description</label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />

      <label>Product Image</label>

      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          list={images}
          setList={updateImagesOrder}
          className="flex flex-wrap gap-2"
        >
          {!!images?.length &&
            images.map((link, index) => (
              <div key={link} className="imageContainerStyle p-1">
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={link}
                  alt={`Uploaded image ${index + 1}`}
                />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="flex justify-center items-center w-24 h-24 bg-gray-200 rounded-lg">
            <Loading />
          </div>
        )}

        <label className=" cursor-pointer w-24 h-24 flex flex-col text-sm gap-1 text-gray-500 rounded-sm bg-white shadow-sm border border-gray-200 justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
            />
          </svg>
          <div>Upload</div>
          <input
            type="file"
            className="hidden"
            onChange={uploadImages}
            multiple
          />
        </label>
        {/* {!images?.length && <div>No images to display</div>} */}
      </div>

      <label>Product Price</label>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}

import Layout from "./components/layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [nextPropertyId, setNextPropertyId] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();

    const isAllPropertiesValid = properties.every(
      (p) => p.name.trim() && p.values.trim()
    );

    if (!isAllPropertiesValid) {
      swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All properties must have a name and values.",
      });
      return;
    }

    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(",").map((value) => value.trim()),
      })),
    };

    try {
      if (editedCategory) {
        data._id = editedCategory._id;
        await axios.put("/api/categories", data);
        // swal.fire("Success", "Category updated successfully.", "success");
      } else {
        await axios.post("/api/categories", data);
        // swal.fire("Success", "Category added successfully.", "success");
      }
      setEditedCategory(null);
      setName("");
      setParentCategory("");
      setProperties([]);
      setNextPropertyId(1);
      fetchCategories();
    } catch (error) {
      console.error("Save category error:", error);
      swal.fire("Error", "There was a problem saving the category.", "error");
    }
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  function deleteCategory(category) {
    swal
      .fire({
        icon: "warning",
        title: "Are you sure?",
        text: `Are you sure you want to delete ${category.name}? This action cannot be undone.`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes",
        confirmButtonColor: "#d33",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          try {
            await axios.delete(`/api/categories?_id=${_id}`);
            // swal.fire({
            //   icon: "success",
            //   title: "Deleted!",
            //   text: `${category.name} has been deleted.`,
            //   confirmButtonColor: "#3085d6",
            // });
            fetchCategories();
          } catch (error) {
            console.error("Delete category error:", error);
            swal.fire(
              "Error",
              "There was a problem deleting the category.",
              "error"
            );
          }
        }
      });
  }

  function addProperty() {
    setProperties((prev) => [
      ...prev,
      // Add 'N/A' as the initial value for the 'values' field
      { id: nextPropertyId, name: "", values: "N/A" },
    ]);
    setNextPropertyId((prevId) => prevId + 1);
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      // If the new values are empty or just whitespace, keep it as "N/A".
      properties[index].values = newValues.trim() ? newValues : "N/A";
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit ${editedCategory.name} Category`
          : "Create New Category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={"Category Name"}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
          />
          <select
            onChange={(ev) => setParentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option value="">No Parent Category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Product Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2"
          >
            Add New Property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={property.id} className="flex gap-1 mb-2">
                {" "}
                {/* Use property.id as the key */}
                <input
                  type="text"
                  value={property.name}
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                  placeholder="Property (Ex: Color)"
                />
                <input
                  type="text"
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, property, ev.target.value)
                  }
                  value={property.values}
                  placeholder="Values, Comma Separated"
                />
                <button
                  onClick={() => removeProperty(index)}
                  type="button"
                  className="btn-red"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
              className="btn-default"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-primary mr-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-red"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);

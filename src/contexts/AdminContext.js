import { myAxios } from "./MyAxios";
import { createContext, useContext, useState } from "react";

export const AdminContext = createContext("");
export const FileProvider = ({ children }) => {


  const [errors, setErrors] = useState({});

  const getLista = async (vegpont, callBack) => {
    try{
        const response =await myAxios.get(vegpont);
        callBack(response.data);
    }catch(err){
        console.log("Hiba történt az adatok lekérésekor.")
    }finally{

    }
  };

  const postAdat = async ({ ...adat }, vegpont) => {
    try {
      await myAxios.post(vegpont, adat, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((resp) => {
          console.log(resp);
   
        });
    } catch (error) {
      console.log(error);
      if (error.response.status === 422) {
        setErrors(error.response.data.errors);
      }
    }
  };
  
  const deleteAdat = async(vegpont, id)=>{
    try{
        const response = await myAxios.delete(vegpont+"/"+id);
        console.log(response)
    }catch(err){
        console.log("Hiba történt az adatok törlésekor!")
    }finally{

    }
}

const putAdat =async(vegpont, id, adat)=>{
    try{
      const response = await myAxios.put(`${vegpont}/${id}`, adat);
        console.log("Sikeres módosítás:", response.data)


    }catch(err){
        console.log("Hiba történt az adatok módosításakor!", err)
    }
}


  return (
    <AdminContext.Provider value={{  putAdat,deleteAdat, postAdat, getLista }}>
      {children}
    </AdminContext.Provider>
  );
};

export default function useAdminContext() {
  return useContext(AdminContext);
}
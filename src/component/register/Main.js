import React, { useEffect, useMemo, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Stepper from "./Stepper";
import axios from "axios";
import Swal from "sweetalert2";
// import containerImg from "../../..public/pexels-andrea-piacquadio-3758114.jpg";
// import swal from "sweetalert2/src/sweetalert2.js";

export const Main = () => {
  const steps = ["Step One", "Step Two"];
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);

  const schema = yup
    .object({
      currentStep: yup.number(),
      email: yup.string().email("Invalid Email").required("Email is required!"),
      firstName: yup.string().required("First Name is required!"),
      lastName: yup.string().required("Last Name is required!"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match"),
      password: yup.string().required("Password is required!").min(5, 'Minimum of 5 characters'),

      type: yup.string().when("currentStep", {
        is: (currentStep) => {
          return currentStep === 2;
        },
        then: () => yup.string().required("Type is required!"),
        otherwise: () => yup.string().notRequired(),
      }),
      company: yup.string().when("currentStep", {
        is: (currentStep) => {
          return currentStep === 2;
        },
        then: () => yup.string().required("Company is required!"),
        otherwise: () => yup.string().notRequired(),
      }),
      address: yup.string().when("currentStep", {
        is: (currentStep) => {
          return currentStep === 2;
        },
        then: () => yup.string().required("Address is required!"),
        otherwise: () => yup.string().notRequired(),
      }),
      city: yup.string().when("currentStep", {
        is: (currentStep) => {
          return currentStep === 2;
        },
        then: () => yup.string().required("City is required!"),
        otherwise: () => yup.string().notRequired(),
      }),
      state: yup.string().when("currentStep", {
        is: (currentStep) => {
          return currentStep === 2;
        },
        then: () => yup.string().required("State is required!"),
        otherwise: () => yup.string().notRequired(),
      }),
      zip: yup.string().when("currentStep", {
        is: (currentStep) => {
          return currentStep === 2;
        },
        then: () => yup.string().required("Zip is required!"),
        otherwise: () => yup.string().notRequired(),
      }),
      country: yup.string().when("currentStep", {
        is: (currentStep) => {
          return currentStep === 2;
        },
        then: () => yup.string().required("Country is required!"),
        otherwise: () => yup.string().notRequired(),
      }),
    })
    .required();

  const [oldData, setOldData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultValues = useMemo(() => {
    return {
      currentStep: currentStep,
      email: oldData?.email || "",
      firstName: oldData?.firstName || "",
      lastName: oldData?.lastName || "",

      password: oldData?.password || "",
      confirmPassword: oldData?.confirmPassword || "",
      type: oldData?.type || "",
      company: oldData?.company || "",
      address: oldData?.address || "",
      city: oldData?.city || "",
      state: oldData?.state || "",
      zip: oldData?.zip || "",
      country: oldData?.country || "",
      userType: "admin", // cant show to view
    };
  }, [currentStep, oldData]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data) => {
    if (currentStep === 1) {
      setOldData({ ...data });
      return setCurrentStep(2);
    }
    return handleSubmitData(data);
  };

  const handleSubmitData = async (payload) => {
    setIsSubmitting(true);
    delete payload.confirmPassword;
    delete payload.currentStep;

    Swal.fire({
      title: "Please wait...",
      allowOutsideClick: false
    });
    Swal.showLoading();
    try {
      const response = await axios.post(
        "https://renting-api.onrender.com/users/register",
        payload,
        {
          headers: {
            Authorization: "Bearer " + "6nv9i5abfaipo2yks0vku611ut9y7x",
          },
        }
      );
      Swal.close();
      const { data } = response;

      if (data && data.success === true) {
        Swal.fire("Account Created", data.msg, "success");
        setOldData({});
        setCurrentStep(1);
        setIsSubmitting(false);
      } else {
        Swal.fire("Oops!", data.msg, "error");
        setIsSubmitting(false);
      }
    } catch (err) {
      setIsSubmitting(false);
      Swal.close();
    }
  };

  const values = watch();

  const handleBack = () => {
    setOldData({ ...values });
    setCurrentStep(1);
  };
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);



  return (
    <div className="w-full h-full sm:h-[700px] sm:w-[1200px] bg-white rounded-none sm:rounded-3xl flex justify-center mx-0 sm:mx-4">
      <div className="w-[80%] bg-blue-500 lg:block hidden rounded-l-3xl">
        <img
          className="w-full h-full object-cover object-left  rounded-l-3xl"
          src="pexels-andrea-piacquadio-3758114.jpg"
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex h-full flex-col justify-between items-center p-2 sm:p-8"
      >
        <div className="flex flex-col justify-center items-center   mt-8 sm:mt-0">
          <h1
            className="font-bold text-green-800 p-0 m-3 text-4xl
          "
          >
            Registration
          </h1>

          <h2>We offer Car Services!</h2>
          <div className="pt-4 pb-6 w-full">
            <Stepper
              steps={steps}
              currentStep={currentStep}
              complete={complete}
              setCurrentStep={setCurrentStep}
              setComplete={setComplete}
            />
          </div>
          <div className="flex justify-center flex-col text-start w-full px-10 text-[#212121] mt-8 sm:my-2">
            {currentStep === 1 ? (
              <>
                <div className="flex m-0 sm:m-2.5 flex-col sm:flex-row">
                  <div className="w-full items-center justify-between mx-2.5">
                    <label className="w-1/3 mr-4 font-semibold">
                      First Name:{" "}
                    </label>
                    <input
                      className={`p-2 w-full bg-slate-200 mt-0.5 rounded-md ${
                        errors.firstName?.message
                          ? "outline-red-700 border-red-700"
                          : "border-black outline-black"
                      }`}
                      {...register("firstName")}
                    />
                    <p className="text-xs text-red-700">
                      {errors.firstName?.message}
                    </p>
                  </div>
                  <div className="w-full items-center justify-between mx-2.5 my-2.5 sm:my-0">
                    <label className="w-1/3 mr-4 font-semibold">
                      Last Name:
                    </label>
                    <input
                      className={`p-2 w-full bg-slate-200 mt-0.5 rounded-md ${
                        errors.lastName?.message
                          ? "outline-red-700 border-red-700"
                          : "border-black outline-black"
                      }`}
                      {...register("lastName")}
                    />
                    <p className="text-xs text-red-700">
                      {errors.lastName?.message}
                    </p>
                  </div>
                </div>
                <div className="w-full items-center justify-between ml-2.5 m-0 sm:mx-[18px] pr-0 sm:pr-[38px] mb-2.5 sm:mb-0">
                  <label className="w-1/3 mr-4 font-semibold">Email:</label>
                  <input
                    className={`p-2 w-full bg-slate-200 mt-0.5 rounded-md ${
                      errors.email?.message
                        ? "outline-red-700 border-red-700"
                        : "border-black outline-black"
                    }`}
                    {...register("email")}
                  />
                  <p className="text-xs text-red-700">
                    {errors.email?.message}
                  </p>
                </div>
                <div className="flex m-0 sm:m-2.5 flex-col sm:flex-row">
                  <div className="w-full items-center justify-between mx-2.5">
                    <label className="w-1/3 mr-4 font-semibold">
                      Password:{" "}
                    </label>
                    <input
                      type="password"
                      className={`p-2 w-full bg-slate-200 mt-0.5 rounded-md ${
                        errors.password?.message
                          ? "outline-red-700 border-red-700"
                          : "border-black outline-black"
                      }`}
                      {...register("password")}
                    />
                    <p className="text-xs text-red-700">
                      {errors.password?.message}
                    </p>
                  </div>
                  <div className="w-full items-center justify-between mx-2.5 my-2.5 sm:my-0">
                    <label className="w-1/3 mr-4 font-semibold">
                      Confirm Password:
                    </label>
                    <input
                      type="password"
                      className={`p-2 w-full bg-slate-200 mt-0.5 rounded-md ${
                        errors.confirmPassword?.message
                          ? "outline-red-700 border-red-700"
                          : "border-black outline-black"
                      }`}
                      {...register("confirmPassword")}
                    />
                    <p className="text-xs text-red-700">
                      {errors.confirmPassword?.message}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex m-0 sm:m-2.5 flex-col sm:flex-row">
                  <div className="w-full items-center justify-between mx-2.5">
                    <label className="w-1/3 mr-4 font-semibold">Type: </label>
                    <input
                      className={`p-2 w-full bg-slate-200 mt-0.5 rounded-md ${
                        errors.type?.message
                          ? "outline-red-700 border-red-700"
                          : "border-black outline-black"
                      }`}
                      {...register("type")}
                    />
                    <p className="text-xs text-red-700">
                      {errors.type?.message}
                    </p>
                    {/* <span>asfasfa</span> */}
                  </div>
                  <div className="w-full items-center justify-between mx-2.5 my-2 sm:my-0 ">
                    <label className="w-1/3 mr-4 font-semibold">Company:</label>
                    <input
                      className={`p-2 w-full bg-slate-200 mt-0.5 rounded-md ${
                        errors.company?.message
                          ? "outline-red-700 border-red-700"
                          : "border-black outline-black"
                      }`}
                      {...register("company")}
                    />
                    <p className="text-xs text-red-700">
                      {errors.company?.message}
                    </p>
                    {/* <span>asfasfa</span> */}
                  </div>
                </div>
                <div className="w-full items-center justify-between ml-2.5 m-0 sm:mx-[18px] pr-0 sm:pr-[38px] mb-2.5 sm:mb-0">
                  <label className="w-1/3 mr-4 font-semibold">Address:</label>
                  <input
                    className={`p-2 w-full bg-slate-200 mt-0.5 rounded-md ${
                      errors.address?.message
                        ? "outline-red-700 border-red-700"
                        : "border-black outline-black"
                    }`}
                    {...register("address")}
                  />
                  <p className="text-xs text-red-700">
                    {errors.address?.message}
                  </p>
                  {/* <span>asfasfa</span> */}
                </div>
                <div className="flex m-0 sm:m-2.5 flex-col sm:flex-row">
                  <div className="w-full items-center justify-between mx-2.5">
                    <label className="w-1/3 mr-4 font-semibold">City: </label>
                    <input
                      className={`p-2 w-full bg-slate-200 mt-0.5 rounded-md ${
                        errors.city?.message
                          ? "outline-red-700 border-red-700"
                          : "border-black outline-black"
                      }`}
                      {...register("city")}
                    />
                    <p className="text-xs text-red-700">
                      {errors.city?.message}
                    </p>
                    {/* <span>asfasfa</span> */}
                  </div>
                  <div className="w-full items-center justify-between mx-2.5 my-2 sm:my-0">
                    <label className="w-1/3 mr-4 font-semibold">State:</label>
                    <input
                      className={`p-2 w-full bg-slate-200 mt-0.5 rounded-md ${
                        errors.state?.message
                          ? "outline-red-700 border-red-700"
                          : "border-black outline-black"
                      }`}
                      {...register("state")}
                    />
                    <p className="text-xs text-red-700">
                      {errors.state?.message}
                    </p>
                    {/* <span>asfasfa</span> */}
                  </div>
                </div>

                <div className="flex m-0 sm:m-2.5 flex-col sm:flex-row">
                  <div className="w-full items-center justify-between mx-2.5">
                    <label className="w-1/3 mr-4 font-semibold">Zip: </label>
                    <input
                      className={`p-2 w-full bg-slate-200 mt-0.5 rounded-md ${
                        errors.zip?.message
                          ? "outline-red-700 border-red-700"
                          : "border-black outline-black"
                      }`}
                      {...register("zip")}
                    />
                    <p className="text-xs text-red-700">
                      {errors.zip?.message}
                    </p>
                  </div>
                  <div className="w-full items-center justify-between mx-2.5 my-2 sm:my-0">
                    <label className="w-1/3 mr-4 font-semibold">Country:</label>
                    <input
                      className={`p-2 w-full bg-slate-200 mt-0.5 rounded-md ${
                        errors.country?.message
                          ? "outline-red-700 border-red-700"
                          : "border-black outline-black"
                      }`}
                      {...register("country")}
                    />
                    <p className="text-xs text-red-700">
                      {errors.country?.message}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="justify-center flex items-center my-8">
            <button
              type="button"
              disabled={currentStep === 1}
              class={`font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 ${
                currentStep === 1
                  ? "bg-slate-300 text-white"
                  : "bg-slate-500 text-black"
              } `}
              onClick={handleBack}
            >
              Back
            </button>
            <input
              type="submit"
              disabled={isSubmitting}
              value={currentStep === 1 ? "Next" : "Confirm"}
              class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

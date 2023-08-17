import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
// import { Transition } from "@headlessui/react";
import TransitionSucces from "@/Components/TransitionSucces";

import axios from "axios";

function Profile({ auth }) {
    // Profile States
    const [userData, setUserData] = useState(null);
    const [photo_data, set_photo_data] = useState("");
    const [photoUploadSuccess, setPhotoUploadSuccess] = useState(false);

    // Post States
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imagePost, setImagePost] = useState("");
    const [posts, setPosts] = useState([]);
    const [postCreatedSuccess, setPostCreatedSuccess] = useState(false);
    const [postUpdatedSuccess, setPostUpdatedSuccess] = useState(false);
    const [postDeletedSuccess, setPostDeletedSuccess] = useState(false);

    // Post Update States
    const [titleValue, setTitleValue] = useState("");
    const [contentValue, setContentValue] = useState("");
    const [updatingPostId, setUpdatingPostId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Pour ajouter une photo de profil
    // const [photo_data, set_photo_data] = useState("");

    const user = usePage().props.auth.user;

    const submit_photo_data = (e) => {
        e.preventDefault();
        const form_data = new FormData();
        const id_image = document.getElementById("photo");
        form_data.append("photo", id_image.files[0]);

        // Hanâa post adresse = http://127.0.0.1:8001/api/photo
        axios
            .post("http://127.0.0.1:8001/api/photo", form_data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                // console.log('response', res);
                set_photo_data(res.data.image);
                fetchUserData();
                setPhotoUploadSuccess(true);
                // After 3 seconds, set photoUploadSuccess back to false
                setTimeout(() => {
                    setPhotoUploadSuccess(false);
                }, 3000);
            })
            .catch((err) => {
                console.error("Failure", err);
            });
    };
    // Fetch user Data et post Data
    const fetchUserData = () => {
        axios
            .get("/user")
            .then((response) => {
                setUserData(response.data);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    };

    const fetchPostData = () => {
        axios
            .get("api/posts")
            .then((response) => {
                setPosts(response.data);
                // set_photo_post();
                // console.log(response.data);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    };

    useEffect(() => {
        fetchUserData();
        fetchPostData();
    }, []);

    ///

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            biographie: user.biographie,
        });

    //  gestion de l'envoi du formulaire de la biographie
    const handleBioSubmit = (event) => {
        event.preventDefault();

        patch(route("bio.update"));
    };
    // // récuperer les posts de l'user
    // useEffect(() => {
    //     axios.get("/posts")
    //     .then((response) => {
    //         setPosts(response.data)
    //         console.log(response.data[0].image);
    //         set_photo_post(response.data[0].image)
    //         ;
    //     });
    // }, []);

    // ajouter un nouveau post
    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        // Check if imagePost has a file
        if (document.getElementById("imagePost").files[0]) {
            formData.append(
                "imagePost",
                document.getElementById("imagePost").files[0]
            );
        }

        axios
            .post("/posts", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                setPosts([response.data, ...posts]);
                setTitle("");
                setContent("");
                setImagePost("");
                setPostCreatedSuccess(true);
                setTimeout(() => {
                    setPostCreatedSuccess(false);
                }, 3000);
            });
    };

    // Pour supprimer un post
    const deletePost = (id) => {
        axios
            .delete(`/posts/${id}`)
            .then((response) => {
                setPosts(posts.filter((post) => post.id !== id));
                setPostDeletedSuccess(true);
                setTimeout(() => {
                    setPostDeletedSuccess(false);
                }, 3000);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    // Gestion du bouton qui permet de mettre à jour un post
    const handleButtonClick = (id) => {
        setUpdatingPostId(id);
        const postToUpdate = posts.find((post) => post.id === id);
        setTitleValue(postToUpdate.title);
        setContentValue(postToUpdate.content);
        setIsUpdating(true); // user is updating
    };

    // Gestion du changement de titre du post
    const handleTitleChange = (event) => {
        setTitleValue(event.target.value);
    };
    // Gestion du changement de Contenu du post
    const handleContentChange = (event) => {
        setContentValue(event.target.value);
    };
    // Fontion pour mettre à jour un post
    const updatePost = (e) => {
        e.preventDefault();
        axios
            .patch(`/posts/${updatingPostId}`, {
                title: titleValue,
                content: contentValue,
                // imagePost: document.getElementById("imageUpdate")
            })
            .then((response) => {
                setPosts(
                    posts.map((post) =>
                        post.id === updatingPostId ? response.data : post
                    )
                );
                setUpdatingPostId(null);
                setTitleValue("");
                setContentValue("");
                setIsUpdating(false); // user is not updating
                setPostUpdatedSuccess(true);
                setTimeout(() => {
                    setPostUpdatedSuccess(false);
                }, 3000);
            })
            .catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                }
            });
    };

    return (
        <>

            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Your Profile</h2>}
            >
                <Head title="Profile" />

                <div
                    class="sm:flex sm:flex-col sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-purple-900 selection:bg-red-500 selection:text-white">
                    <div className="m-3">
                    </div>
                    <div className="w-screen flex flex-col items-center justify-center space-y-6">
                        {/* <h1 className="text-center text-white text-4xl m-2">Your Profile</h1> */}
                        {/* Show the picture and the form for sending new picture in the database */}
                        <form onSubmit={submit_photo_data}
                            className="bg-gray-200 text-center ml-12 p-6 space-y-4 rounded-xl w-2/3 lg:w-1/2 ">
                            <div className="flex flex-col justify-center items-center">
                                <div
                                    key={user.id}
                                    className="w-1/4 ml-12 p-6 text-center m-4 space-y-4 bg-purple-200 block rounded-xl"
                                >
                                    <img
                                        src={
                                            userData && userData.image
                                                ? `http://127.0.0.1:5173/storage/app/public/images/${userData.image}`
                                                : `http://127.0.0.1:5173/storage/app/public/images/imagepardefault.png`
                                        }
                                        alt="User Profile"
                                    />
                                </div>
                            </div>

                            <form onSubmit={submit_photo_data} className="m-4 space-y-6">
                                <label htmlFor="photo"> Upload Photo to profile </label>
                                <input
                                    name="photo"
                                    id="photo"
                                    type="file"
                                // onChange={e => setData("image", e.target.files[0])}
                                ></input>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="submit"
                                        onClick={submit_photo_data}
                                        className="m-2 px-4 py-2 block text-white bg-purple-600 rounded-lg shadow-md hover:bg-black duration-500 "
                                    >
                                        Upload Photo
                                    </button>
                                    <TransitionSucces
                                        show={photoUploadSuccess}
                                        message="
                                        Succesfuly added."
                                    />
                                </div>
                            </form>

                            {/* Formulaire de mise à jour de la biographie */}
                            <form
                                onSubmit={handleBioSubmit}
                                className="mt-6 space-y-6 ml-12 bg-gray-200 w-2/3 lg:w-1/2 p-2 rounded-xl"
                            >
                                <div className="w-3/2 p-6">
                                    <InputLabel
                                        htmlFor="biographie"
                                        value="Biographie"
                                    />

                                    <TextInput
                                        id="biographie"
                                        type="text"
                                        className="mt-1 block w-10/12 te"
                                        value={data.biographie}
                                        onChange={(e) =>
                                            setData("biographie", e.target.value)
                                        }
                                        required
                                        autoComplete="biographie"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.biographie}
                                    />
                                </div>
                                {/* Save button */}
                                <div className="flex items-center gap-4">
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                        className="mt-2 px-4 py-2 m-2 block bg-purple-600 hover:bg-black duration-500 "
                                    >
                                        Save
                                    </PrimaryButton>
                                    {/* Apparition du mot save quand on met à jour la biographie */}
                                    <TransitionSucces
                                        show={recentlySuccessful}
                                        message="Saved."
                                    />
                                </div>
                            </form>
                        </form>
                        {/* Formulaire pour l'ajout d'un nouveau post */}

                        <form
                            onSubmit={handleSubmit}
                            className="bg-gray-200 text-center ml-12 p-6 space-y-4 rounded-xl w-2/3 lg:w-1/2 "
                        >
                            <h2 className="text-center m-2 font-bold">
                                Add a new post
                            </h2>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                className="block w-2/4 min-w-fit border rounded-lg shadow-md"
                                required
                            />
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Content"
                                className="block w-2/4 min-w-fit mt-2 border rounded-lg shadow-md"
                            />
                            <label htmlFor="imagePost"> Picture </label>
                            <input
                                name="imagePost"
                                id="imagePost"
                                type="file"
                                onChange={(e) => setImagePost(e.target.files[0])}
                            ></input>

                            <button
                                type="submit"
                                className="m-2 px-4 py-2 block text-white bg-purple-600 rounded-lg shadow-md hover:bg-black duration-500 "
                            >
                                Create post
                            </button>
                            <TransitionSucces
                                show={postCreatedSuccess}
                                message="Succesfuly added."
                            />
                        </form>

                        {/* Affichage des posts de l'user */}
                        {/* Si l'user est en train de Maj un post les input seront affichés sinon ce sera les text field qui seront affichés */}
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="w-2/3 lg:w-1/3 ml-12 p-3 text-center m-4 space-y-2 bg-purple-200 block rounded-xl"
                            >
                                {/* Vérifier l'état si l'user update ou pas */}
                                {isUpdating && updatingPostId === post.id ? (
                                    <>
                                        <div className="flex items-center">
                                            <input
                                                name="imagePost"
                                                id="imageUpdate"
                                                type="file"
                                                onChange={(e) =>
                                                    // {console.log(e.target.files[0].name)}
                                                    setImagePost(e.target.files[0])
                                                }
                                            ></input>
                                            <p className="mr-2">Title:</p>
                                            <TextInput
                                                // value={title}
                                                type="text"
                                                // onChange={handleTitleChange}
                                                value={titleValue}
                                                id="titleUpdate"
                                                required
                                                autoComplete="inputTitle"
                                                name="title"
                                                onChange={(e) =>
                                                    setTitleValue(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <p className="mr-2">Content:</p>
                                            <TextInput
                                                type="text"
                                                onChange={handleContentChange}
                                                value={contentValue}
                                                id="contentUpdate"
                                                required
                                                autoComplete="inputContent"
                                                name="content"
                                            />
                                        </div>
                                        <button
                                            onClick={updatePost}
                                            className="mt-2 px-4 py-2 m-2 block text-white bg-purple-600 rounded-lg shadow-md hover:bg-black duration-500 "
                                        >
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-center h-96">
                                            <img
                                                className="object-cover h-5/5 min-w-contain w-auto"
                                                src={`http://127.0.0.1:5173/storage/app/public/images/${post.image}`}
                                            />
                                        </div>

                                        <h2>Title: {post.title}</h2>
                                        <p>Content: {post.content}</p>
                                        <button
                                            onClick={() =>
                                                handleButtonClick(post.id)
                                            }
                                            className="mt-2 px-4 py-2 m-2 block text-white bg-purple-600 rounded-lg shadow-md hover:bg-black duration-500 "
                                        >
                                            Update
                                        </button>

                                        <button
                                            onClick={() => deletePost(post.id)}
                                            className="mt-2 px-4 py-2 m-2 block text-white bg-purple-600 rounded-lg shadow-md hover:bg-black duration-500"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}

                                <div
                                    className="fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-2xl">
                                    <TransitionSucces
                                        show={postDeletedSuccess}
                                        message="Post deleted successfully."
                                        variant="delete"
                                    />
                                    <TransitionSucces
                                        show={postUpdatedSuccess}
                                        message="Post Succesfully updated."
                                        variant="delete"
                                    />
                                </div>
                            </div>
                        ))}

                    </div>
                    <div className="m-4">

                    </div>
                </div>

            </AuthenticatedLayout>
        </>
    );
}

export default Profile;

import React, { useState } from 'react'
import './styles.css';
import Input from '../Input';
import Button from '../../Button';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import { auth,db, provider } from '../../firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
function SignupSigninComponent() {
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [loginForm,setLoginForm] =useState(false);
    const [loading,setLoading]=useState(false);
    const navigate =useNavigate();
    function signupWithEmail(){
        setLoading(true);
        // console.log("Name",name);
        // console.log("email",name);
        // console.log("password",name);
        // console.log("confirmpassword",name);
        if(name!=="" && email!=="" && password!=="" && confirmPassword!==""){
            if(password===confirmPassword){
                createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("User",user);
            toast.success("User Created");
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            createDoc(user);
            navigate("/dashboard");
             // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorMessage);
                setLoading(false);
                // ..
            });
            }else{
                toast.error("Password and ConfirmPassword don't match");
                setLoading(false);
            }
            
            
        }else{
            toast.error("All fields are mandatory");
            setLoading(false);
        }
        
    }
    function LoginUsingEmail(){
        setLoading(true);
        if( email!=="" && password!==""){
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            toast.success("User Logged In!");
            setLoading(false);
            navigate("/dashboard");
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setLoading(false);
            toast.error(errorMessage);
        });
    }else{
        toast.error("All fields are mandatory");
        setLoading(false);
    }
    }
    async function createDoc(user){
        setLoading(true);
        if (!user)return;
        const userRef=doc(db, "users", user.uid);
        const userData= await getDoc(userRef);
        if(!userData.exists()){
            try{
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName ? user.displayName : name,
                    email:user.email,
                    photoURL:user.photoURL?user.photoURL:"",
                    createAt:new Date(),
                });
                toast.success("Doc created");
                setLoading(false);
            }catch(e){
                toast.error(e.message);
                setLoading(false);
            }
        }else{
            //toast.error("Doc already exists!");
            setLoading(false);
        }
        
        
    }

    function googleAuth(){
        setLoading(true);
        try{
            signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                createDoc(user);
                navigate("/dashboard")
                toast.success("User authenticated");
                setLoading(false);
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorMessage);
                setLoading(false);
                // The email of the user's account used.
              // ...
            });
        }catch(e){
            toast.error(e.message);
            setLoading(false);
        }
        
    }
  return (
    <>
    {loginForm? (
        <div className='signup-wrapper'>
        <h2 className='title'>Log in <span style={{color:"var(--theme)"}}>Financely. </span>
        </h2>
        <form>
           
            <Input
                type="email"
                label={"Email"}
                state={email}
                setState={setEmail}
                placeholder={"Example@gmail.com"}
            />
            <Input
                type="password"
                label={"Password"}
                state={password}
                setState={setPassword}
                placeholder={"Example@123"}
            />
            
            <Button
                disabled={loading}
                text={loading ?"loading...":"Login Using Email and Password"} 
                onClick={LoginUsingEmail}
                 />
            <p className='p-login'>--OR--</p>
            <Button
                onClick={googleAuth}
                text={loading ? "loading..." :"Login Using Google"} blue={true}/>
            <p 
             className='p-login'
             style={{cursor:"pointer"}}
             onClick={()=>setLoginForm(!loginForm)}
            >Or Dont Have an Account Already?</p>
        </form>

    </div>
    ):(
    <div className='signup-wrapper'>
        <h2 className='title'>Sign Up on <span style={{color:"var(--theme)"}}>Financely. </span>
        </h2>
        <form>
            <Input
                type="text"
                label={"Full Name"}
                state={name}
                setState={setName}
                placeholder={"John Doe"}
            />
            <Input
                type="email"
                label={"Email"}
                state={email}
                setState={setEmail}
                placeholder={"Example@gmail.com"}
            />
            <Input
                type="password"
                label={"Password"}
                state={password}
                setState={setPassword}
                placeholder={"Example@123"}
            />
            <Input
                type="password"
                label={"Confirm Password"}
                state={confirmPassword}
                setState={setConfirmPassword}
                placeholder={"Example@123"}
            />
            <Button
                disabled={loading}
                text={loading ?"loading...":"Signup Using Email and Password"} 
                onClick={signupWithEmail}
                 />
            <p className='p-login'>--OR--</p>
            <Button
                onClick={googleAuth}
                text={loading ? "loading..." :"Signup Using Google"} blue={true}/>
             <p 
              className='p-login'
              style={{cursor:"pointer"}}
              onClick={()=>setLoginForm(!loginForm)}
             >Or Have an Account? Click Here</p>
        </form>

    </div>
    )}
    
    </>
  );
}

export default SignupSigninComponent;
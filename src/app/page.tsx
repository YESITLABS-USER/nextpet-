"use client";
import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import Slider from "../components/Slider";
import Homeabout from "../components/Homeabout";
import Homenearyou from "../components/Homenearyou";
import RecentlyPosted from "../components/RecentlyPosted";
import HomeRecentlyPostedSlider from "../components/HomeRecentlyPostedSlider";
import HomeAppSec from "../components/HomeAppSec";
import HomePopularBreddersSec from "../components/HomePopularBreddersSec";
import HomeTrendingPets from "../components/HomeTrendingPets";
import axios from "axios";
import BASE_URL from "../app/utils/constant";
import { PostLike } from "../app/services/user/post";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import BreederPopup from '../components/BreederPopup'

function Page() {
  const [homePageData, setHomePageData] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);

  const [data, setData] = useState({
    msg: "",
    msg_type: "",
    status: "",
    code: null,
    nearyou: [],
    recently_post: [],
    trending_pets: [],
    popular_breeder: [],
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("user_user_id");

      if(storedUserId){
        setUserId(storedUserId);
        NearYou(storedUserId);
      } else{
        NearYou();
      }
    }
    // NearYou();
    // getHomePageData();
  }, []);

  useEffect(() => {
    // NearYou();
    getHomePageData();
  }, [userId]);

  const NearYou = async (userId = '') => {
    try {
      const response = await axios.post(`${BASE_URL}/api/all_post_listing`, {
        user_id: userId,
        latitude: 28.6215001,
        longitude: 77.3905665, 
      });

      setData(response.data);
    } catch (err) {
      console.log("error : ", err);
    }
  };

  const NearYouLike = async (breeder_id: string | number, post_id: string | number, check_like: string) => {
    const payload:any = {
      user_id:'',
      post_id:'',
      breeder_id: '',
      like_post: ''
    };

    if (check_like == "0") {
      payload.user_id = userId;
      payload.post_id = post_id;
      payload.breeder_id = breeder_id;
      payload.like_post = 1;
    } else {
      payload.user_id = userId;
      payload.post_id = post_id;
      payload.breeder_id = breeder_id;
      payload.like_post = 111;
    }

    try {
      await PostLike(payload);
      NearYou(payload.user_id);
    } catch (error) {
      console.error("Error in NearYouLike:", error);
    }
  };

  const getHomePageData = async () => {
    const apiURL = `${BASE_URL}/api/get_homepage`;
    try {
      const response = await axios.get(apiURL);
      if (response.data.code === 200) {
        setHomePageData(response.data.data);
      }
    } catch (err) {
      console.log("error : ", err);
    }
  };

  interface PostLikeValue {
    like_colour: string | null;
    breeder_id?: string;
    user_breeder_id?: string;
    id?: string | number;
  }

  const handlePostLike = async (value:PostLikeValue) => {
    const checkLikeDislike = value?.like_colour == null ? 1 : 111;
    const payload:any = {
      user_id:'',
      post_id:'',
      breeder_id: '',
      like_post: ''
    };
      payload.user_id = userId;
      payload.breeder_id = value?.breeder_id || "";
      payload.like_post = checkLikeDislike;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/breeder_like`,
        payload
      );
      if (response.data.code === 200) {
        NearYou(payload.user_id);
      }
    } catch (err) {
      console.log("error : ", err);
    }
  };

  
  const handleRecentPostLike = async (value:PostLikeValue) => {
    const checkLikeDislike = value?.like_colour == null ? 1 : 111;
    const payload:any = {
      user_id:'',
      post_id:'',
      breeder_id: '',
      like_post: ''
    };
    // const likeData: any = {
      payload.user_id = userId;
      payload.post_id = value?.id;
      payload.breeder_id = value?.user_breeder_id;
      payload.like_post = checkLikeDislike;
    // };
    try {
      const response = await axios.post(`${BASE_URL}/api/like_post`, payload);
      if (response.data.code === 200) {
        NearYou(payload.user_id);
      }
    } catch (err) {
      console.log("error : ", err);
    }
  };

  return (
    <>
      <ToastContainer />
      <BreederPopup />
      <Banner homePageData={homePageData} />
      <Slider />
      <Homeabout homePageData={homePageData} />
      <Homenearyou slides={data.nearyou} onLike={NearYouLike} />
      <RecentlyPosted />
      <HomeRecentlyPostedSlider
        slides={data.recently_post}
        onClick={handleRecentPostLike}
      />
      <HomeAppSec homePageData={homePageData} />
      <HomePopularBreddersSec
        slides={data.popular_breeder}
        onClick={handlePostLike}
      />
      <HomeTrendingPets slides={data.trending_pets} onLike={NearYouLike} />
    </>
  );
}

export default Page;

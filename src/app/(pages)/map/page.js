"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import { MdLocationOn } from "react-icons/md";
import Select from "react-select";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import BASE_URL from "../../utils/constant";

// Dynamically import the Map component to ensure it only runs on the client
const Map = dynamic(() => import("../../../components/Map"), { ssr: false });

const Index = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [activeRadio, setActiveRadio] = useState("");
  const [allPets, setAllPets] = useState([]);
  const [animalTypes, setAnimalTypes] = useState([]);
  const [animalBreeds, setAnimalBreeds] = useState([]);
  const [animalTypeFilter, setAnimalTypeFilter] = useState("");
  const [breedTypeFilter, setBreedTypeFilter] = useState("");
  const [userIdOrBreederId, setUserIdOrBreederId] = useState(null);
  const [filter, setFilter] = useState(null);
  const [location, setLocation] = useState(null);
  const [recentDate, setRecentDate] = useState(null);
  // const [mapLocation, setMapLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [ requiredFields, setRequiredFields] = useState(false);
  const [searchItemParam, setSearchItem] = useState('');

  const { isAuthenticated } = useAuth();
    
  // const { searchItem } = router.query;
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setLocation([latitude, longitude]); // Update the map center
  //       },
  //       (error) => {
  //         console.error("Error fetching location:", error.message);
  //       }
  //     );
  //   } else {
  //     console.error("Geolocation is not supported by this browser.");
  //   }
  // }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search);
      const searchItemParam = queryParams.get('searchItem');
      setSearchItem(searchItemParam || '');  
    }
    const debounceTimeout = setTimeout(() => {
      if (!searchItemParam) return;

      const query = searchItemParam.toLowerCase();
      const filtered = allPets.filter((pet) => {
        return (
          pet.type?.toLowerCase().includes(query) ||
          pet.name?.toLowerCase().includes(query) ||
          pet.breed?.toLowerCase().includes(query) ||
          pet.location?.toLowerCase().includes(query)
        );
      });

      setFilteredData(filtered);
    }, 500); // Set the debounce delay to 500ms

    // Cleanup the timeout if the searchItem or dependencies change
    return () => clearTimeout(debounceTimeout);
  }, [searchItemParam, allPets]);


  useEffect(() => {
    if (filter === "nearby" && navigator.geolocation) {
      setRecentDate(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setActiveRadio("nearby");
        },
        () => alert("Unable to retrieve your location.")
      );
    }
    if (filter === "recent") {
      setLocation(null);
      const today = new Date().toISOString().split("T")[0];
      setRecentDate(today);
      setActiveRadio("recent");
    }

    if (activeRadio == "nearby" || activeRadio == "recent") {
      if(userIdOrBreederId){
        getAllPets();
      } else {
        getAllPetsWithoutLogin();
      }
    }
  }, [filter, activeRadio]);

  useEffect(() => {
    const userId = localStorage.getItem("user_user_id");
    const breaderId = localStorage.getItem("breeder_user_id");
    if (userId) {
      setUserIdOrBreederId(userId);
    } else if (breaderId) {
      setUserIdOrBreederId(breaderId);
    }
    isAuthenticated ? getAllPets() : getAllPetsWithoutLogin();
    fetchAnimalTypes();
  }, [userIdOrBreederId]);

  const getAllPets = async (filters = {}) => {
    let user = {
      user_id: userIdOrBreederId,
      type: filters.animalType || animalTypeFilter,
      breed: filters.breedType || breedTypeFilter,
      recent: recentDate,
      latitude: location?.latitude,
      longitude: location?.longitude,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/api/all_pets_listing`,
        user
      );
      if (response.data.code === 200) {
        setAllPets(response.data.pets_list);
        setFilteredData(response.data.pets_list); // Set filtered data when no filter is applied
      }
    } catch (err) {
      console.error("error : ", err);
    }
  };

  const getAllPetsWithoutLogin = async (filters = {}) => {
    let user = {
      type: filters.animalType || animalTypeFilter,
      breed: filters.breedType || breedTypeFilter,
      recent: "recent",
      latitude: location?.latitude,
      longitude: location?.longitude,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/api/all_pets_listing_without_login`, user
      );
      if (response.data.code === 200) {
        setAllPets(response.data.pets_list_without_login);
        setFilteredData(response.data.pets_list_without_login); // Set filtered data when no filter is applied
      }
    } catch (err) {
      console.error("error : ", err);
    }
  };

  const fetchAnimalTypes = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/additional_request_web`
      );
      const animalData = response.data.data.map((item) => item.animal);
      const formattedAnimalTypes = animalData.map((animal) => ({
        value: animal.toLowerCase().replace(/\s+/g, "_"),
        label: animal,
      }));
      formattedAnimalTypes.push({ value: "other", label: "Other" });
      setAnimalTypes(formattedAnimalTypes);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSelectedAnimalTypesChange = async (selectedOption) => {
    setAnimalTypeFilter(selectedOption);
    if (selectedOption.value === "other") {
      getAllPets();
      const modalElement = document.querySelector('.modal');
      const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    } else {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/additional_request_web`
        );
        const formattedBreedTypes = response.data.data
          .find((item) => item.animal === selectedOption.label)
          .sub[0].breed_type.map((item) => ({
            value: item,
            label: item,
          }));

        setAnimalBreeds(formattedBreedTypes);
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  const fillterPets = () => {
    if (recentDate || location || animalTypeFilter || breedTypeFilter) {
      setAnimalTypeFilter(null);
      setBreedTypeFilter(null);
  
      // If there are filters, set filtered data
      if (userIdOrBreederId) {
        getAllPets({
          latitude: location?.latitude,
          longitude: location?.longitude,
          recent: recentDate,
          animalType: animalTypeFilter,
          breedType: breedTypeFilter
        });
      } else {
        getAllPetsWithoutLogin({
          latitude: location?.latitude,
          longitude: location?.longitude,
          recent: recentDate,
          animalType: animalTypeFilter,
          breedType: breedTypeFilter
        });
      }
    } else {
      // When no filter is applied, reset to all pets
      setFilteredData(allPets);
    }
  };
  
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value.length < 1) {
      setFilteredData();
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const query = searchQuery.toLowerCase();
  
    const filtered = allPets.filter((pet) =>
      ["type", "name", "breed", "location"].some((key) =>
        pet[key]?.toLowerCase().includes(query)
      )
    );
  
    setFilteredData(filtered);
  };
  
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };


  function handleModel() {
    setDropdownVisible(!isDropdownVisible);
  }

  return (
    <>
      <div className="pets-breeder-wrap">
        <div className="map-main-wrap">
          <div className="container">
            <div className="aligns-filter-pets">
              <div className="searchbar-filter-sec">
                <div className="search-wrap">
                <form onSubmit={handleSearch}>
                  <label>
                    <input
                      type="text"
                      value={searchQuery}
                      onKeyDown={handleKeyDown}
                      onChange={handleSearchChange}
                      placeholder="Search by Animal Type, Breed or Location"
                    />
                    <button type="submit">
                      <Image
                        width={23}
                        height={23}
                        src="/images/Nextpet-imgs/all-icons/serch2.svg"
                        alt="search"
                      />
                    </button>
                  </label>
                </form>

                </div>
              </div>
              <div className="search-filter-sec">
                <div className="pets-filters-wrap">
                  <div className="filter-sec">
                    <div className="quotes2">
                      <div className="dropdown-filterbtn" onClick={handleModel}>Sort
                        <Image width={23} height={23} src="/images/Nextpet-imgs/dashboard-imgs/mi_filter.svg" alt="filter"/>
                      </div>
                      <div className="dropdown-showfilter"
                           style={{
                            display: isDropdownVisible ? "block" : "none",
                          }}
                      >
                        <div className="quotes-list" >
                          <div className="filter-data-list">
                            <input 
                              type="radio"
                              name="exp_language2"
                              value="nearby"
                              checked={filter === "nearby"}
                              onChange={() => setFilter("nearby")}/>
                            <p>Nearby</p>
                          </div>

                          <div className="filter-data-list">
                            <input 
                              type="radio"
                              name="exp_language2"
                              value="recent"
                              checked={filter === "recent"}
                              onChange={() => setFilter("recent")}/>

                            <p>Recent</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="filter-sec">
                    <div className="quotes2">
                      <div className="dropdown-filterbtn" data-bs-target="#contact-coach" data-bs-toggle="modal">Filter
                        <Image width={23} height={23} src="/images/Nextpet-imgs/dashboard-imgs/mi_filter.svg" alt="filter"/>
                      </div>

                    </div>
                  </div>
                  <div className="location-filter">
                    <a onClick={() => setFilter("nearby")}>
                      {/* <i className="fas fa-map-marker-alt"></i> */}
                      <MdLocationOn className="fas fa-map-marker-alt"
                      style={{ color: "#e49a01", margin: "12px", cursor: "pointer" }}
                      size={20} />
                    </a>
                    <button type="button">
                      <Image width={23} height={23} src="/images/Nextpet-imgs/all-icons/filter-map-icon.svg" alt="filter-map-icon"/></button>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal fade modal-common" id="contact-coach" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
              <div class="modal-dialog modal-dialog-edit" role="document">
                <div class="modal-content">
                  <div class="modal-heading">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                  <div className="conatctcpach-popup-wrap">
                  <Image
                    width={71}
                    height={71}
                    src="/images/Nextpet-imgs/all-icons/filter-pop-icon.svg"
                    alt=""
                  />
                  <h1>Filter</h1>
                  <div className="coach-form-wrap">
                    <Select
                      options={animalTypes}
                      placeholder="Select an Animal Type"
                      value={animalTypeFilter}
                      styles={{
                        container: (provided) => ({
                          ...provided,
                        }),
                        control: (provided) => ({
                          ...provided,
                          backgroundColor: "transparent",
                          border: `2px solid ${requiredFields && !animalTypeFilter ? 'red' : 'rgb(230 158 1)'}`,
                          borderRadius: "10px",
                        }),
                      }}
                      onChange={(selectedOption) =>
                        handleSelectedAnimalTypesChange(selectedOption)
                      }
                      label={animalTypeFilter ? animalTypeFilter.label : ""}
                    />
                    <Select
                      options={animalBreeds}
                      placeholder="Select a Breed Type"
                      value={breedTypeFilter}
                      styles={{
                        container: (provided) => ({
                          ...provided,
                        }),
                        control: (provided) => ({
                          ...provided,
                          backgroundColor: "transparent",
                          border: `2px solid ${requiredFields && !breedTypeFilter ? 'red' : 'rgb(230 158 1)'}`,
                          borderRadius: "10px",
                        }),
                      }}
                      onChange={(selectedOption) =>
                        setBreedTypeFilter(selectedOption)
                      }
                      label={breedTypeFilter ? breedTypeFilter.label : ""}
                    />
                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        data-bs-dismiss={animalTypeFilter && breedTypeFilter ? "modal" : ''} // Modal closes 
                        onClick={() => {
                          if (!animalTypeFilter || !breedTypeFilter) {
                            setRequiredFields(true);
                          } else if(animalTypeFilter || breedTypeFilter){
                            fillterPets();
                          } else {
                            setRequiredFields(false);
                          }
                        }}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map component */}
          <Map data={filteredData && filteredData.length > 0 ? filteredData : allPets} location={location} />

        </div>
    </div>
    </>
  );
};

export default Index;
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const isValidUser = localStorage.getItem("authToken");
  //     if (!isValidUser) {
  //       toast.error("User or Breeder Must be logged in");
  //       router.push("/");
  //     }
  //   }
  // }, [router]);
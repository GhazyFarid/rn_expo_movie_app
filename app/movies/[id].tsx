import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useFetch from "@/src/services/useFetch";
import { fetchMovieDetails } from "@/src/services/api";
import { icons } from "@/src/constants/icons";
import { getDeviceId } from "@/src/utils/device";
import {
    getOneHistoryMovie,
    updateHistoryMovie,
} from "@/src/helpers/appwrite/historyMovies";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppSelector } from "@/src/store/hooks";

interface MovieInfoProps {
    label: string;
    value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-200 font-normal text-sm">{label}</Text>
        <Text className="text-light-100 font-bold text-sm mt-2">
            {value || "N/A"}
        </Text>
    </View>
);

const MovieDetails = () => {
    const { id } = useLocalSearchParams();
    const deviceId = getDeviceId();
    const user = useAppSelector((state) => state.user.userData);

    const { data: movie, loading } = useFetch(() =>
        fetchMovieDetails(id as string)
    );

    const [isSaved, setIsSaved] = useState<Boolean>(false);

    const { data: dataAppwrite, loading: loadingOneHistory } = useFetch(() =>
        getOneHistoryMovie({ deviceId: String(deviceId), movieId: String(id), uid: user?.uid ?? '' })
    );

    useEffect(() => {
        if (!loadingOneHistory && dataAppwrite) {
            // console.log("dataAppwrite.is_saved", dataAppwrite.is_saved);
            setIsSaved(dataAppwrite.is_saved);
        }
    }, [dataAppwrite, loadingOneHistory]);

    const saveData = async (status: Boolean) => {
        console.log("status", status);
        if (!movie) {
            console.log("Movie data is not available");
            return;
        }
        if (!user) {
            console.log("User not logged in");
            return;
        }

        setIsSaved(status);
        console.log(`movieId : ${String(id)} deviceId : ${String(deviceId)} userId : ${user.uid} status : ${status}`);
        await updateHistoryMovie(String(id), String(deviceId), user.uid, status, movie);
    };

    if (loadingOneHistory) {
        return (
            <View className="bg-primary flex-1 justify-center items-center">
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View className="bg-primary flex-1">
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                <View>
                    <Image
                        source={{
                            uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                        }}
                        className="w-full h-[550px]"
                        resizeMode="stretch"
                    />
                    <View className="flex flex-1 items-end -mt-6 mr-5">
                        <TouchableOpacity onPress={() => saveData(!isSaved)}>
                            <View className="bg-black items-center justify-center border-2  w-12 h-12 border-white rounded-md">
                                <MaterialIcons
                                    name={isSaved ? `save-as` : `save-alt`}
                                    size={25}
                                    color="white"
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="flex-col items-start justify-center mt-5 px-5">
                    <Text className="text-white font-bold text-xl">
                        {movie?.title}
                    </Text>
                    <View className="flex-row items-center gap-x-1 mt-2">
                        <Text className="text-light-200 text-sm">
                            {movie?.release_date?.split("-")[0]}
                        </Text>
                        <Text className="text-light-200 text-sm">
                            {movie?.runtime}m
                        </Text>
                    </View>
                    <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
                        <Image source={icons.star} className="size-4" />
                        <Text className="text-white font-bold text-sm">
                            {Math.round(movie?.vote_average ?? 0)}/10
                        </Text>
                        <Text className="text-light-200 text-sm">
                            ({movie?.vote_count} votes)
                        </Text>
                    </View>
                    <MovieInfo label="Overview" value={movie?.overview} />
                    <MovieInfo
                        label="Genres"
                        value={
                            movie?.genres?.map((g) => g.name).join(" - ") ||
                            "N/A"
                        }
                    />
                    <View className="flex flex-row justify-between w-1/2">
                        <MovieInfo
                            label="Budget"
                            value={`$${
                                (movie?.budget ?? 0) / 1_000_000
                            } million`}
                        />
                        <MovieInfo
                            label="Revenue"
                            value={`$${Math.round(
                                (movie?.revenue ?? 0) / 1_000_000
                            )} million`}
                        />
                    </View>

                    <MovieInfo
                        label="Production Companies"
                        value={
                            movie?.production_companies
                                .map((c) => c.name)
                                .join(" - ") || "N/A"
                        }
                    />
                </View>
            </ScrollView>
            <TouchableOpacity
                className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
                onPress={router.back}>
                <Image
                    source={icons.arrow}
                    className="size-5 mr-1 mt-0.5 rotate-180"
                    tintColor="#fff"
                />
                <Text className="text-white font-semibold text-base">
                    Go Back
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default MovieDetails;

import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import { SERVER_HOST } from "../../../apis/api";


const Music1 = () => {
    const clientId = "2092cfbbbbe74243a175d76aae0ac458";
    const clientSecret = "fc059ee140644f49b8ca85d9f5621fb2";
    const accessToken =
        "BQCqod2HiADdXtYxRpNnln8EJBLSyk0xdUV0u8d0ODUr4cqOr8AF9v-VecRmwwV0pVDVnho4M4khbYTAx-vhIKjlu-P6bP8EkamlQE1YektDkLnT1bg";

    const [musics, setMusics] = useState([]);

    const data = qs.stringify({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
    });

    const musicList = () => {
        axios({
            method: "get",
            url: "https://api.spotify.com/v1/playlists/37i9dQZF1DWT9uTRZAYj0c/tracks",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }).then((response) => {
            setMusics([...response.data.items]);
        });
    };

    const getToken = () => {
        axios({
            method: "post",
            url: "https://accounts.spotify.com/api/token",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: data,
        })
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const inputMusic = async () => {
        musics.map((music) => {
            const musicData = {
                itemName: music.track.name,
                itemType: "배경음악",
                sourceName: music.track.artists[0].name,
                fileName: music.track.preview_url,
                price: 100,
                status: "visible",
                bgmImg: music.track.album.images[1].url,
            };

            axios({
                method: "POST",
                url: `${SERVER_HOST}/item/musicsave`,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(musicData),
            }).then((response) => {
                const { data, status } = response;
                if (status === 201) {
                    console.log("저장성공!");
                } else {
                    console.log("저장 실패!");
                }
            });
        });
    };
    return (
        <div>
            <button onClick={getToken}>토큰 생성</button>
            <button onClick={musicList}>리스트 받기</button>
            <button onClick={inputMusic}>DB 저장</button>
            <ul>
                {musics.map((music) => (
                    <li>
                        <img src={music.track.album.images[1].url} />
                        <br />
                        {music.track.album.name} : {music.track.artists[0].name} : {music.track.name} : {music.added_at}
                        <audio controls>
                            <source src={music.track.preview_url} type='audio/mpeg' />
                            Your browser does not support the audio element.
                        </audio>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Music1;

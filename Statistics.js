// Una gráfica con el número de películas vistas todos los meses, de forma que se vea la tendencia de consumo del usuario
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../assets/colors";
import { useQueries, useQuery } from "@tanstack/react-query";
import { collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase-config";
import { ref } from "firebase/storage";
import { useRoute } from "@react-navigation/native";
import MovieScreen from "./MovieScreen";
import { useAuth } from "../AuthProvider";
import { BarChart, PieChart } from "react-native-chart-kit";
import axios from "axios";
import Svg, { Path, Circle } from "react-native-svg";
import { ContributionGraph } from "react-native-chart-kit";
import { ProgressChart } from "react-native-chart-kit";
import { FlashList } from "@shopify/flash-list";

const Genres = ({ genres, numberOfMovies }) => {
  // Tendremos una lista de no más de 10 géneros

  const formatList = () => {
    const principal = genres.slice(0, 9);
    const rest = genres.slice(9, -1);
    let others = 0;
    rest.forEach((genre) => {
      others += genre[1];
    });
    return [...principal, ["Others", others]];
  };

  return (
    <View style={{ paddingVertical: 20 }}>
      <Text
        style={{
          color: "white",
          fontSize: 40,
          fontFamily: "System",
          fontWeight: "600",
          paddingBottom: 20,
        }}
      >
        Genres
      </Text>
      <FlatList
        data={formatList()}
        renderItem={(genre) => (
          <Genre
            genreName={genre.item[0]}
            numberOfFilms={genre.item[1]}
            totalNumberOfFilms={numberOfMovies}
            maxFilms={genres?.[0]?.[1]}
          />
        )}
      />
    </View>
  );
};

const Genre = ({ genreName, totalNumberOfFilms, numberOfFilms, maxFilms }) => {
  const proportion = (numberOfFilms * 100) / maxFilms;
  return (
    <View style={{ width: "100%", justifyContent: "center" }}>
      <View
        style={{
          height: 30,
          backgroundColor: colors.WORDS_COLOR,
          borderRadius: 5,
          opacity: 0.4,
          width: `${proportion}%`,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          marginVertical: 2.5,
          maxWidth: "100%",
        }}
      >
        <Text
          style={{
            paddingLeft: 10,
            color: "white",
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {genreName}
        </Text>
      </View>
      <Text
        style={{
          color: "white",
          paddingRight: 10,
          position: "absolute",
          zIndex: 999,
          right: 10,
        }}
      >
        {numberOfFilms} films
      </Text>
    </View>
  );
};

const NanoGenres = ({ nanoGenres, numberOfMovies }) => {
  // Tendremos una lista de no más de 10 géneros

  const formatList = () => {
    const principal = nanoGenres.slice(0, 9);
    const rest = nanoGenres.slice(9, -1);
    let others = 0;
    rest.forEach((genre) => {
      others += genre[1];
    });
    return [...principal, ["Others", others]];
  };

  return (
    <View style={{ paddingVertical: 20 }}>
      <Text
        style={{
          color: "white",
          fontSize: 40,
          fontFamily: "System",
          fontWeight: "600",
          paddingBottom: 20,
        }}
      >
        Nano genres
      </Text>
      <FlatList
        data={formatList()}
        renderItem={(genre) => (
          <Genre
            genreName={genre.item[0]}
            numberOfFilms={genre.item[1]}
            totalNumberOfFilms={numberOfMovies}
            maxFilms={nanoGenres?.[0]?.[1]}
          />
        )}
      />
    </View>
  );
};

const FavouriteYear = ({ mostWatchedYear }) => {
  return (
    <View
      style={{
        marginVertical: 30,
        borderRadius: 15,
        backgroundColor: colors.INPUT_COLOR,
        paddingVertical: 15,
        paddingHorizontal: 5,
      }}
    >
      <View style={{ alignItems: "flex-start" }}>
        <Text
          style={{
            color: "white",
            paddingBottom: 20,
            fontSize: 34,
            paddingLeft: 10,
            fontWeight: "600",
          }}
        >
          Favourite year
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        {/* El AÑO */}
        <View
          style={{ flex: 7, alignItems: "center", justifyContent: "center" }}
        >
          <Text
            style={{
              color: colors.WORDS_COLOR,
              fontFamily: "System",
              fontSize: 68,
              fontWeight: "700",
            }}
          >
            {mostWatchedYear[1]}
          </Text>
          <Text style={{ color: "gray", fontWeight: "500", fontSize: 19 }}>
            {mostWatchedYear[0].length} films
          </Text>
        </View>
        {/* PELÍCULAS */}
        <View style={{ flex: 6, width: "100%", alignItems: "flex-start" }}>
          <FlatList
            scrollEnabled={false}
            numColumns={4}
            data={mostWatchedYear[0].slice(0, 16)}
            renderItem={(movie) => (
              <View
                style={{
                  width: "24%",
                  alignItems: "center",
                  paddingBottom: 3,
                  marginLeft: 1,
                }}
              >
                <Image
                  style={{ width: 43, height: 65, borderRadius: 3 }}
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${movie?.item?.moviePic}`,
                  }}
                />
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const Movie = ({ movie }) => {
  return (
    <View
      style={{
        borderRadius: 15,
        flexDirection: "row",
        flex: 1,
      }}
    >
      <View
        style={{
          alignItems: "center",
          borderRadius: 10,
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            style={{
              width: 92,
              height: 175,
              borderRadius: 5,
            }}
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.moviePic}`,
            }}
          />
        </View>
        <Text
          style={{
            color: "white",
            fontWeight: "600",
            fontSize: 13,
            paddingTop: 0,
          }}
        >
          {movie?.movieRuntime} min
        </Text>
      </View>
    </View>
  );
};

const Provider = ({ provider }) => {
  return (
    <View
      style={{
        width: 100,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
      }}
    >
      <Image
        style={{ width: 70, height: 70, borderRadius: 70 }}
        source={{
          uri: `https://image.tmdb.org/t/p/w500${provider?.providerLogoPic}`,
        }}
      />
      <Text
        style={{ color: "white", paddingTop: 10, fontWeight: "500" }}
      >{`${provider?.count} films`}</Text>
    </View>
  );
};

const Actor = ({ actor }) => {
  return (
    <View style={{ alignItems: "center", width: "50%", paddingVertical: 10 }}>
      <Image
        style={{ width: 120, height: 120, borderRadius: 120 }}
        source={{
          uri: `https://image.tmdb.org/t/p/w500${actor?.actorProfilePic}`,
        }}
      />
      <Text
        style={{
          paddingTop: 10,
          color: "white",
          fontSize: 13,
          fontWeight: "500",
        }}
      >
        {actor.actorName}
      </Text>
      <Text
        style={{ color: "gray", fontSize: 15, fontWeight: 5 }}
      >{`${actor.cuenta} films`}</Text>
    </View>
  );
};

const Chooser = ({ title, options, state, setState }) => {
  const onPress = () => {
    setState((prev) => !prev);
  };

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        paddingTop: 30,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingLeft: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontWeight: "600",
          fontSize: 30,
          paddingRight: 10,
        }}
      >
        {title.toUpperCase()}
      </Text>
      {/* <View style={{ justifyContent: "center" }}>
        <View
          style={{
            backgroundColor: colors.INPUT_COLOR,
            height: 1,
            opacity: 0.3,
          }}
        />
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={{ paddingLeft: 10 }} onPress={onPress}>
          <Text style={{ color: state ? "white" : colors.PINK_COLOR }}>
            {options[0].toUpperCase()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingLeft: 10 }} onPress={onPress}>
          <Text style={{ color: !state ? "white" : colors.PINK_COLOR }}>
            {options[1].toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const NumberOf = (props) => {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      {!props.isStillLoadingSome ? (
        <View
          style={{
            backgroundColor: "gray",
            borderRadius: 10,
            width: 45,
            height: 40,
          }}
        />
      ) : (
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 23, fontWeight: "600" }}>
            {props.number}
          </Text>
          <Text
            style={{
              color: colors.WORDS_COLOR,
              fontSize: 13,
              fontWeight: "500",
            }}
          >
            {props.text.toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );
};

const MoviesByLanguageChart = ({ userWatchedMovies }) => {
  const [languagesData, setLanguagesData] = useState([]);
  const [languageMap, setLanguageMap] = useState({});

  function generateLightColor() {
    const r = Math.floor(Math.random() * 128) + 127; // Valores entre 127 y 255
    const g = Math.floor(Math.random() * 128) + 127; // Valores entre 127 y 255
    const b = Math.floor(Math.random() * 128) + 127; // Valores entre 127 y 255

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  const fetchLanguages = async () => {
    const response = await axios.get(
      "https://api.themoviedb.org/3/configuration/languages",
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZWIwNTY0NzcxYjAwYTFiMTE2NjQ5NWQzZWZmYzI3MSIsInN1YiI6IjY1MTNmMDE2Y2FkYjZiMDJiZGViYWMwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jqZeYyXUptvRW386HRXK0ih7cWHAIF52D90xJ8fb0nY`,
        },
      }
    );

    const languageMap = {};
    response.data.forEach((lang) => {
      languageMap[lang.iso_639_1] = lang.english_name;
    });

    return languageMap;
  };

  useEffect(() => {
    const fetchMoviesData = async () => {
      // console.log("Ejecución iniciada");

      try {
        const languageCounts = {};
        const map = await fetchLanguages(); // Obtener el mapeo de idiomas desde la API
        setLanguageMap(map);

        // Procesar cada película con async/await
        await Promise.all(
          userWatchedMovies.map(async (movieId) => {
            const response = await axios.get(
              `https://api.themoviedb.org/3/movie/${movieId}`,
              {
                headers: {
                  Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZWIwNTY0NzcxYjAwYTFiMTE2NjQ5NWQzZWZmYzI3MSIsInN1YiI6IjY1MTNmMDE2Y2FkYjZiMDJiZGViYWMwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jqZeYyXUptvRW386HRXK0ih7cWHAIF52D90xJ8fb0nY`,
                },
              }
            );

            const language = response.data.original_language;

            // Incrementar el contador para el idioma
            languageCounts[language] = (languageCounts[language] || 0) + 1;
          })
        );

        // Convertir el objeto languageCounts en un array de datos para el PieChart
        const data = Object.entries(languageCounts)
          .map(([language, count]) => ({
            name: map[language] || language.toUpperCase(), // Usar el nombre completo o el código si no está en el mapa
            count: count,
            color: generateLightColor(), // Generar colores claros
            legendFontColor: "#ffffff", // Color de la leyenda
            legendFontSize: 12,
          }))
          .sort((a, b) => b.count - a.count); // Ordenar de mayor a menor

        setLanguagesData(data);
      } catch (error) {
        console.error("Error al obtener datos de películas:", error);
      }
    };

    fetchMoviesData();
  }, [userWatchedMovies]);

  return (
    <View style={{ marginVertical: 50, width: "100%", alignItems: "center" }}>
      <Text style={{ fontWeight: "bold", color: "white" }}>
        Proporción de Idiomas en las Películas Vistas
      </Text>
      {languagesData.length > 0 ? (
        <PieChart
          data={languagesData}
          width={Dimensions.get("window").width - 20} // Ancho del gráfico
          height={220} // Altura del gráfico
          chartConfig={{
            backgroundColor: "#0f0f19",
            backgroundGradientFrom: "#0f0f19",
            backgroundGradientTo: "#0f0f19",
            color: () => `rgba(255, 255, 255, 1)`, // Color para las leyendas
          }}
          accessor={"count"} // Campo que contiene los valores
          backgroundColor={"transparent"} // Fondo transparente
          paddingLeft={"15"} // Alineación del gráfico
          absolute // Muestra valores absolutos en lugar de porcentajes
        />
      ) : (
        <Text style={{ color: "white" }}>Cargando estadísticas...</Text>
      )}
    </View>
  );
};

const MoviesByYearChart = ({ userWatchedMovies }) => {
  const [moviesByYear, setMoviesByYear] = useState([]);

  useEffect(() => {
    const fetchMoviesData = async () => {
      // console.log("Ejecución iniciada");

      try {
        const yearCounts = {};

        // Procesar cada película con async/await
        await Promise.all(
          userWatchedMovies.map(async (movieId) => {
            const response = await axios.get(
              `https://api.themoviedb.org/3/movie/${movieId}`,
              {
                headers: {
                  Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZWIwNTY0NzcxYjAwYTFiMTE2NjQ5NWQzZWZmYzI3MSIsInN1YiI6IjY1MTNmMDE2Y2FkYjZiMDJiZGViYWMwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jqZeYyXUptvRW386HRXK0ih7cWHAIF52D90xJ8fb0nY`,
                },
              }
            );

            const releaseYear = new Date(
              response.data.release_date
            ).getFullYear();

            // Incrementar el contador para el año de lanzamiento
            yearCounts[releaseYear] = (yearCounts[releaseYear] || 0) + 1;
          })
        );

        // Convertir el objeto yearCounts en un array de { x, y } para Victory
        const data = Object.entries(yearCounts).map(([year, count]) => ({
          x: parseInt(year, 10),
          y: count,
        }));

        setMoviesByYear(data.sort((a, b) => a.x - b.x)); // Ordenar por año
      } catch (error) {
        console.error("Error al obtener datos de películas:", error);
      }
    };

    // Llamar a la función de datos de películas
    fetchMoviesData();
  }, [userWatchedMovies]);

  const labels = moviesByYear.map((item) => item.x.toString()); // Años como etiquetas
  const data = moviesByYear.map((item) => item.y); // Conteo de películas

  // console.log(moviesByYear, "moviesByYear");
  return (
    <View style={{ alignContent: "center" }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 20,
          textAlign: "center",
          color: "white",
        }}
      >
        Distribución de Películas por Año
      </Text>
      {moviesByYear.length > 0 ? (
        <View style={{ right: 20 }}>
          <BarChart
            data={{
              labels: labels,
              datasets: [
                {
                  data: data,
                },
              ],
            }}
            width={Dimensions.get("window").width} // Ancho del gráfico
            height={300} // Altura del gráfico
            fromZero={true} // Inicia el eje Y desde cero
            chartConfig={{
              propsForHorizontalLabels: {
                dx: -15, // Ajusta la posición horizontal de las etiquetas
              },
              propsForVerticalLabels: {
                dx: -10, // Ajusta la posición horizontal de las etiquetas
                dy: 10,
              },
              labelColor: () => "#ffffff", // Color blanco para todas las etiquetas

              backgroundColor: "#0f0f19",
              backgroundGradientFrom: "#0f0f19",
              backgroundGradientTo: "#0f0f19",
              decimalPlaces: 0, // Sin decimales
              color: () => "rgba(52, 168, 235, 0.7)", // Color sólido de las barras
              style: {
                borderRadius: 16,
              },
              barPercentage: 0.3, // Grosor de las barras
            }}
            verticalLabelRotation={45} // Rotar etiquetas del eje X
            style={{
              marginVertical: 10,
              borderRadius: 16,
            }}
          />
        </View>
      ) : (
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      )}
    </View>
  );
};

const exampleCountries = ["US", "ES", "FR", "IT", "IN"];

// const WorldMap = ({ countries }) => {
//   const [highlightedCountries, setHighlightedCountries] = useState([]);

//   useEffect(() => {
//     // Simula que obtienes los países donde se produjeron películas
//     setHighlightedCountries(countries);
//   }, [countries]);

//   const getFillColor = (countryCode) => {
//     return highlightedCountries.includes(countryCode) ? "#34a8eb" : "#d3d3d3";
//   };

//   const handleCountryPress = (countryName) => {
//     Alert.alert("País Seleccionado", `Películas producidas en: ${countryName}`);
//   };

//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Svg
//         width="100%"
//         height="100%"
//         viewBox="0 0 2000 1001"
//         preserveAspectRatio="xMidYMid meet"
//       >
//         {/* Ejemplo con algunos países */}
//         <G>
//           {/* Estados Unidos */}
//           <Path
//             d="M300 300 L400 300 L400 400 L300 400 Z" // Cambia este Path al real desde el archivo SVG
//             fill={getFillColor("US")}
//             onPress={() => handleCountryPress("United States")}
//           />
//           {/* España */}
//           <Path
//             d="M500 500 L600 500 L600 600 L500 600 Z" // Cambia este Path al real desde el archivo SVG
//             fill={getFillColor("ES")}
//             onPress={() => handleCountryPress("Spain")}
//           />
//           {/* Francia */}
//           <Path
//             d="M600 400 L700 400 L700 500 L600 500 Z" // Cambia este Path al real desde el archivo SVG
//             fill={getFillColor("FR")}
//             onPress={() => handleCountryPress("France")}
//           />
//         </G>
//       </Svg>
//     </View>
//   );
// };

// const SvgComponent = (props) => (
//   <Svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="#ececec"
//     stroke="#000"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     strokeWidth={0.2}
//     viewBox="0 0 2000 2000" // Ajusta según las dimensiones originales
//     width={"100%"} // Ancho fijo en px
//     height={500} // Alto fijo en px
//     {...props}
//   >
//     <Path d="m1383 261.6 1.5 1.8-2.9.8-2.4 1.1-5.9.8-5.3 1.3-2.4 2.8 1.9 2.7 1.4 3.2-2 2.7.8 2.5-.9 2.3-5.2-.2 3.1 4.2-3.1 1.7-1.4 3.8 1.1 3.9-1.8 1.8-2.1-.6-4 .9-.2 1.7h-4.1l-2.3 3.7.8 5.4-6.6 2.7-3.9-.6-.9 1.4-3.4-.8-5.3 1-9.6-3.3 3.9-5.8-1.1-4.1-4.3-1.1-1.2-4.1-2.7-5.1 1.6-3.5-2.5-1 .5-4.7.6-8 5.9 2.5 3.9-.9.4-2.9 4-.9 2.6-2-.2-5.1 4.2-1.3.3-2.2 2.9 1.7 1.6.2h3l4.3 1.4 1.8.7 3.4-2 2.1 1.2.9-2.9 3.2.1.6-.9-.2-2.6 1.7-2.2 3.3 1.4-.1 2 1.7.3.9 5.4 2.7 2.1 1.5-1.4 2.2-.6 2.5-2.9 3.8.5h5.4z" />
//     <Path
//       d="m1121.2 572 .6 2-.7 3.1.9 3-.9 2.4.4 2.2-11.7-.1-.8 20.5 3.6 5.2 3.6 4-10.4 2.6-13.5-.9-3.8-3-22.7.2-.8.5-3.3-2.9-3.6-.2-3.4 1.1-2.7 1.2-.5-4 .9-5.7 2-5.9.3-2.7 1.9-5.8 1.4-2.6 3.3-4.2 1.9-2.9.6-4.7-.3-3.7-1.6-2.3-1.5-3.9-1.3-3.8.3-1.4 1.7-2.5-1.6-6.2-1.2-4.3-2.8-4.1.6-1.2 2.3-.9 1.7.1 2-.7 16.7.1 1.3 4.7 1.6 3.9 1.3 2.1 2.1 3.3 3.8-.5 1.8-.9 3.1.9.9-1.6 1.5-3.7 3.5-.3.3-1.1h2.9l-.5 2.3 6.8-.1.1 4.1 1.1 2.4-.9 3.9.4 4 1.8 2.4-.4 7.6 1.4-.6 2.4.2 3.5-1 2.6.4ZM1055.3 539l-1.5-4.8 2.3-2.8 1.7-1.1 2.1 2.2-2 1.4-1 1.6-.2 2.8-1.4.7Z"
//       className="Angola"
//       fill={colors.PINK_COLOR}
//     />
//     <Path d="m1088 228 .4 1.2 1.4-.6 1.2 1.7 1.3.7.6 2.3-.5 2.2 1 2.7 2.3 1.5.1 1.7-1.7.9-.1 2.1-2.2 3.1-.9-.4-.2-1.4-3.1-2.2-.7-3 .1-4.4.5-1.9-.9-1-.5-2.1 1.9-3.1zM1296.2 336.7l1.3 5.1h-2.8v4.2l1.1.9-2.4 1.3.2 2.6-1.3 2.6v2.6l-1 1.4-16.9-3.2-2.7-6.6-.3-1.4.9-.4.4 1.8 4.2-1 4.6.2 3.4.2 3.3-4.4 3.7-4.1 3-4 1.3 2.2z" />
//     <Path
//       d="m669.1 851.7-3-.2h-5l-6-13.6 3.1 2.8 4.3 4.6 7.8 3.7 7.3 1.5-.8 3-4.4.3-3.3-2.1ZM638.6 644.7l11.3 10.4 4.6 1 7.3 4.8 5.9 2.5 1.1 2.8-4.2 9.8 5.8 1.7 6.3 1 4.2-1 4.3-5 .3-5.6 2.6-1.3 3.2 3.8.4 5.1-4.2 3.5-3.3 2.6-5.3 6.3-6 8.7-.5 5.2-.4 6.6 1.2 6.4-.9 1.4.4 4.1.3 3.4 7.8 5.5.2 4.4 3.9 2.8.3 3.1-3.3 8.2-7 3.5-10.2 1.3-6-.7 2.1 3.9.1 4.7 1.8 3.2-2.5 2.3-5.1.9-5.6-2.4-1.5 1.7 2.5 6.3 4 1.9 2.3-2 2.5 3.3-4.2 2-2.9 4 1.2 6.3-.1 3.4h-4.8l-3 3.2.1 4.8 6.5 4.6 5.2 1.2.2 5.7-4.6 3.5-.6 7.3-3.5 2.4-.9 2.9 4.2 6.5 4.6 3.5-2.1-.3-4.9-1-12.1-.8-3.5-3.6-1.9-4.6-3.1.4-2.6-2.3-3.1-6.5 2.7-2.8.1-3.9-1.8-3.2.7-5.4-1.1-8.3-1.8-3.7 1.8-1.2-1.4-2.4-2.8-1.2.8-2.7-3.1-2.4-3.7-7.3 1.7-1.3-3.3-7.8-.8-6.5-.2-5.7 2.5-2.3-3.3-6.3-1.6-5.8 3-4.2-1.4-5.4 1.6-6.2-1.4-5.9-1.6-1.2-4.9-11.1 2.1-6.6-1.7-6.2.9-5.9 2.6-6 3.3-4-2-2.5.8-2.1-1.6-10.7 5.6-3.1 1.2-6.7-.9-1.6 4-5.8 7.5 1.6 3.7 4.6 1.6-5.2 6.4.3 1 1.4Z"
//       className="Argentina"
//     />
//     <Path d="m1230.8 253-1.8.2-2.8-3.7-.2-1h-2.3l-1.9-1.7-1 .1-2.4-1.8-4.2-1.6-.1-3.1-1.3-2.2 7-1 1.4 1.6 2.2 1.1-.7 1.6 3.2 2.2-1.1 2.1 2.6 1.7 2.5 1 .9 4.5z" />
//     <Path
//       d="m1743 763.6 3.7 2.2 3.3-.9 4.9-1.2 2.8.4-4.5 7.6-3.3 2.1-4 5.2-.6-1.8-6.6 4.4-.8-.3-3-.2.5-5.4 2-4.2.6-5.6 2-2.9 3 .6ZM1793.5 590.2l1.2 5 4-2.4 1.4 2.7 2.3 2.5-1.1 2.9.2 5.5.2 3.2 1.3.8.4 5.5-1.2 3.3.8 4.3 5.4 3.4 3.2 3 3.2 2.8-1.1 1.6 2.3 4 .5 7 2.6-1.4 1.5 2.7 1.6-.9-.7 6.8 2.9 3.9 1.9 2.4 2.8 5.2v5.2l-1 3.7-1.8 3.9.7 5.5-2.5 5.7-2.1 3-3.8 5.7-1.5 3.7-3.1 4.6-5 5.8-5.5 3.2-4.4 4.9-3.3 3.2-4.4 5.5-3.7 3.2-3.9 4.8-3.1 4.4-.8 2.1-4.3 2.2-6.1.2-6.3 2.7-3.8 2.4-4.8 2.8-2.7-2.9-2.6-1.1 2.6-3.3-3.5 1.2-7.2 4.6-3.6-1.7-2.4-1-2.8-.5-4.1-1.8-1.3-4 1.5-4.8.4-3.3-1.4-2.6-4.7-.7 3.2-3.2.9-4.7-4.7 4.4-5.3 1.2 4.5-3.5 2.5-3.7 3.5-3.2 1.6-4.7-6.8 5.4-4.3 2.2-4.3 5.1-3-2.6 1.7-3.4-1.4-4.7-1.8-2.4 1.6-1.5-5.3-3.9-3.8-.1-4-3.2-9.9.6-7.9 2.3-6.9 2.2-5-.4-7 3.3-5.3 1.4-2.3 3.4-3 2.6-4.7.2-3.6.5-4.2-1.1-4.2.7-3.8.3-4.5 3.4-1.5-.3-3.4 1.8-3.4 2-3.8-.2h-3.5l-4.1-4.1-2.4-1.2 1.5-3.7 2.9-.9 1.5-1.4.6-2.3 2.3-4.5.7-3.8-.7-6.5.2-3.7 1.4-3.6-.9-4.2.3-1.9-1.7-2.6.7-5-1.9-5.1-.1-2.7 1.8 2.8-.5-6 2.3 1.9 1.1 2.5.6-3.3-1.6-5.1-.1-2-.8-1.9 1.3-3.7 1.5-1.6 1.3-3.2.1-3.8 3.1-4.6-.4 4.9 3.1-4.4 4.9-2.2 3.2-2.7 4.7-2.4 2.6-.5 1.4.8 4.8-2.4 3.5-.7 1.1-1.4 1.5-.6 3.1.2 6.2-1.9 3.5-2.9 2-3.4 3.9-3.2.7-2.6.7-3.5 4.9-5.5 1.4 5.6 2.6-1.3-1.5-3 2.3-3.1 2.2 1.4 1.5-4.9 3.5-3.2 1.8-2.5 2.9-1.1.4-1.8 2.3.7.4-1.6 2.6-.9 2.8-.9 3.7 3 2.6 3.8h3.5l3.5.6-.7-3.5 3.5-5.1 2.7-1.7-.6-1.6 2.9-3.7 3.7-2.3 2.7.8 4.9-1.2.3-3.3-3.9-2.1 3.1-.9 3.6 1.6 2.7 2.6 4.5 1.6 1.7-.6 3.3 2 3.5-1.9 2 .6 1.5-1.3 2.2 3.2-2 3.5-2.5 2.6-1.9.2.3 2.5-2.2 3.2-2.5 3.2.2 1.8 3.8 3.6 4 2 2.5 2.2 3.3 3.8h1.6l2.6 1.7.5 2 4.9 2.1 4.1-2.2 1.8-3.4 1.7-2.9 1.3-3.5 2.6-5.1-.2-3.1.7-1.9-.1-3.6 1.4-4.9 1.3-1.3-.6-2.1 1.8-3.4 1.5-3.5.4-1.9 2.3-2.4 1.3 3.2-.1 4 1.3.8-.1 2.7 1.6 3.2-.1 3.7-.6 2.3Z"
//       className="Australia"
//     />
//     <Path d="m1070.6 190.8-.3.8.7 2.1-.2 2.6h-2.8l1.1 1.4-1.3 4-.9 1.1-4.4.1-2.4 1.5-4.2-.5-7.3-1.7-1.3-2.1-4.9 1.1-.5 1.2-3.1-.9-2.6-.2-2.3-1.2.7-1.5-.2-1.1 1.4-.3 2.7 1.7.6-1.7 4.4.3 3.5-1.1 2.4.2 1.7 1.3.4-1.1-1-4.1 1.7-.8 1.6-2.9 3.8 2.1 2.6-2.6 1.7-.5 4 1.9 2.3-.3 2.4 1.2z" />
//     <Path
//       d="m1229 253.2-3.8-.9-3.2-2.9-1.2-2.5 1-.1 1.9 1.7h2.3l.2 1 2.8 3.7ZM1235.3 236.2l2.5-2.6 3.5 3.3 3.6 4.6 2.5.3 1.9 1.7-4.2.5.1 5-.4 2.2-1.7 1.5.8 3.1-1.3.4-3.9-3.4 1.2-3.1-1.9-1.9-1.9.5-5.3 4.7-.9-4.5-2.5-1-2.6-1.7 1.1-2.1-3.2-2.2.7-1.6-2.2-1.1-1.4-1.6 1.1-1.1 4.2 1.9 2.9.3.6-.7-3.3-3.5 1.2-.8 1.5.2 4.3 3.8 2.4.5.6-1.6Z"
//       className="Azerbaijan"
//     />
//     <Path d="m1154.9 530.4-.6.1v-.3l-2-6.1-.01-.06-.09-1.04-1.4-2.9 3.5.5 1.7-3.7 3.1.4.3 2.5 1.2 1.5v2.1l-1.4 1.3-2.3 3.4-2 2.3zM1016.5 177.1l-.4 4.2-1.3.2-.4 3.5-4.4-2.9-2.5.5-3.5-2.9-2.4-2.5-2.2-.1-.8-2.2 3.9-1.2 3.6.5 4.5-1.3 3.1 2.7 2.8 1.5zM1006.7 427l-.2 2.1 1.3 3.8-1.1 2.6.6 1.7-2.8 4-1.7 2-1.1 4 .2 4.1-.3 10.3-4.7.8-1.4-4.4.3-14.8-1.2-1.3-.2-3.2-2-2.2-1.7-1.9.7-3.4 2-.7 1.1-2.8 2.8-.6 1.2-1.9 1.9-1.9h2l4.3 3.7z" />
//     <Path d="m988.5 406-.5 3.1.8 2.9 3.1 4.2.2 3.1 6.5 1.5-.1 4.4-1.2 1.9-2.8.6-1.1 2.8-2 .7-4.9-.1-2.6-.5-1.8 1-2.5-.5-9.8.3-.2 3.7.8 4.8-3.9-1.6-2.6.2-2 1.6-2.5-1.3-1-2.2-2.5-1.4-.4-3.7 1.6-2.7-.2-2.2 4.5-5.3.9-4.4 1.5-1.6 2.7.9 2.4-1.3.8-1.7 4.3-2.8 1.1-2 5.3-2.7 3.1-.9 1.4 1.2h3.6zM1500.6 360.3l.6 4.6-2.1-1 1.1 5.2-2.1-3.3-.8-3.3-1.5-3.1-2.8-3.7-5.2-.3.9 2.7-1.2 3.5-2.6-1.3-.6 1.2-1.7-.7-2.2-.6-1.6-5.3-2.6-4.8.3-3.9-3.7-1.7.9-2.3 3-2.4-4.6-3.4 1.2-4.4 4.9 2.8 2.7.3 1.2 4.5 5.4.9 5.1-.1 3.4 1.1-1.6 5.4-2.4.4-1.2 3.6 3.6 3.4.3-4.2h1.5l4.4 10.2zM1132.6 221.6l-2.3 2.6-1.3 4.5 2.1 3.6-4.6-.8-5 2 .3 3.2-4.6.6-3.9-2.3-4 1.8-3.8-.2-.8-4.2-2.8-2.1.7-.8-.6-.8.6-2 1.8-2-2.8-2.7-.7-2.4 1.1-1.4 1.8 2.6 1.9-.4 4 .9 7.6.4 2.3-1.6 5.9-1.5 4 2.3 3.1.7zM1083 214.3l1.9-.1-1.1 2.8 2.7 2.5-.5 2.9-1.1.3-.9.6-1.6 1.5-.4 3.5-4.8-2.4-2.1-2.7-2.1-1.4-2.5-2.4-1.3-1.9-2.7-3 .8-2.6 2 1.5 1-1.4 2.3-.1 4.5 1.1 3.5-.1 2.4 1.4zM1141.6 162.7l-3.9-.2-.8.6 1.5 2 2 4-4.1.3-1.3 1.4.3 3.1-2.1-.6-4.3.3-1.5-1.5-1.7 1.1-1.9-.9-3.9-.1-5.7-1.5-4.9-.5-3.8.2-2.4 1.6-2.3.3-.5-2.8-1.9-2.8 2.8-1.3-.4-2.4-1.7-2.3-.6-2.7h4.7l4.8-2.3.5-3.4 3.6-2-1-2.7 2.7-1 4.6-2.3 5.3 1.5.9 1.5 2.4-.7 4.8 1.4 1.1 2.9-.7 1.6 3.8 4 2.1 1.1v1.1l3.4 1.1 1.7 1.6-1.6 1.3zM487.8 399.8h-1.7l1.3-7.2.7-5.1.1-1 .7-.3.9.8 2.5-3.9 1.1-.1-.1 1h1l-.3 1.8-1.3 2.7.4 1-.9 2.3.3.6-1 3.3-1.3 1.7-1.1.2-1.3 2.2zM662.5 631.4l-.3-2-5.4-3.3-5.2-.1-9.6 1.9-2.1 5.6.2 3.5-1.5 7.7-1-1.4-6.4-.3-1.6 5.2-3.7-4.6-7.5-1.6-4 5.8-3.9.9-3.1-8.9-3.7-7.2 1.1-6.2-3.2-2.7-1.2-4.6-3.2-4.4 2.9-6.9-2.9-5.4 1.1-2.2-1.2-2.4 1.9-3.2-.3-5.4v-4.6l1.1-2.1-5.5-10.4 4.2.6 2.9-.2 1.1-1.9 4.8-2.6 2.9-2.4 7.3-1.1-.4 4.8.9 2.5-.3 4.3 6.5 5.7 6.4 1.1 2.3 2.4 3.9 1.3 2.5 1.8h3.5l3.4 1.9.5 3.7 1.2 1.9.3 2.7-1.7.1 2.8 7.5 10.7.3-.5 3.7.8 2.5 3.2 1.8 1.7 4-.6 5.1-1.3 2.8.8 3.6-1.6 1.4z" />
//     <Path d="m665.8 489.6 3.1.6.6-1.4-1-1.2.6-1.9 2.3.6 2.7-.7 3.2 1.4 2.5 1.3 1.7-1.7 1.3.2.8 1.8 2.7-.4 2.2-2.5 1.8-4.7 3.4-5.9 2-.3 1.3 3.6 3 11.2 3.1 1.1.1 4.4-4.3 5.3 1.7 1.9 10.1 1 .2 6.5 4.3-4.2 7.1 2.3 9.5 3.9 2.8 3.7-.9 3.6 6.6-2 11 3.4 8.5-.2 8.4 5.3 7.4 7.2 4.4 1.8 4.8.3 2.1 2 2 8.2 1.1 3.9-2.1 10.6-2.7 4.2-7.7 8.9-3.4 7.3-4 5.5-1.4.2-1.3 4.7.9 12-1.1 9.9-.3 4.2-1.6 2.6-.5 8.6-5.2 8.3-.5 6.7-4.3 2.7-1.1 3.9h-6l-8.5 2.4-3.7 2.9-6 1.9-6.1 5.1-4.1 6.4-.3 4.8 1.3 3.5-.3 6.5-.8 3.1-3.4 3.6-4.5 11.3-4 5-3.2 3.1-1.5 6.1-2.9 3.6-2.1-3.6 1.8-3.1-3.8-4.3-4.8-3.6-6.3-4.1-1.9.2-6.3-5-3.4.7 6-8.7 5.3-6.3 3.3-2.6 4.2-3.5-.4-5.1-3.2-3.8-2.6 1.3.7-3.7.3-3.8-.3-3.6-2.1-1.1-2 1-2.1-.3-.8-2.4-1.1-5.9-1.2-1.9-3.9-1.8-2.2 1.3-5.9-1.3-.4-8.7-2-3.5 1.6-1.4-.8-3.6 1.3-2.8.6-5.1-1.7-4-3.2-1.8-.8-2.5.5-3.7-10.7-.3-2.8-7.5 1.7-.1-.3-2.7-1.2-1.9-.5-3.7-3.4-1.9h-3.5l-2.5-1.8-3.9-1.3-2.3-2.4-6.4-1.1-6.5-5.7.3-4.3-.9-2.5.4-4.8-7.3 1.1-2.9 2.4-4.8 2.6-1.1 1.9-2.9.2-4.2-.6-3.2 1.1-2.6-.7-.1-9.7-4.4 3.7-5-.1-2.3-3.5-3.8-.3 1-2.8-3.3-3.9-2.6-5.8 1.5-1.1-.2-2.8 3.4-1.8-.7-3.5 1.4-2.2.3-3 6.3-4.4 4.6-1.2.8-1 5.1.3 2.2-17.6.1-2.8-.9-3.6-2.6-2.4.1-4.7 3.2-1 1.1.7.2-2.5-3.3-.7v-4l11 .2 1.9-2.3 1.6 2.1 1 3.8 1.1-.8 3.1 3.4 4.4-.4 1.1-2 4.2-1.5 2.4-1.1.7-2.7 4.1-1.8-.3-1.4-4.8-.5-.7-4.1.3-4.3-2.5-1.6 1.1-.6 4.1.8 4.5 1.6 1.7-1.5 4.1-1 6.4-2.4 2.1-2.5-.7-1.8 3-.2 1.2 1.4-.8 2.9 2 .9 1.2 3-1.6 2.3-1 5.4 1.4 3.3.3 3 3.5 3 2.8.3.6-1.3 1.8-.3 2.6-1.1 1.8-1.7 3.2.6 1.3-.3zM1633.1 472.8l2.2-2.4 4.6-3.6-.1 3.2-.1 4.1-2.7-.2-1.1 2.2-2.8-3.3zM1488.8 323.5l2.6 2.1.5 3.9-4.5.2-4.7-.4-3.2 1-5.5-2.5-.4-1.2 2.6-4.8 2.6-1.6 4.3 1.4 2.9.2 2.8 1.7zM1127.6 615.7l1.9 5.1 1.1 1.2 1.6 3.7 6.1 7 2.3.7-.1 2.3 1.5 4.1 4.3 1 3.4 2.9-8.1 4.7-5.2 4.8-2 4.3-1.8 2.4-3 .5-1.2 3.1-.6 2-3.6 1.4-4.5-.3-2.5-1.8-2.3-.7-2.8 1.4-1.5 3.1-2.7 1.9-2.8 2.9-4 .7-1.1-2.3.6-3.9-3-6.1-1.4-1 .6-18.7 5.5-.2.8-22.9 4.2-.2 8.7-2.3 2 2.7 3.7-2.5h1.7l3.2-1.5 1 .5zM1121.3 446.5l3.9 2.5 3.1 2.6.1 2.1 3.9 3.3 2.4 2.8 1.4 3.8 4.3 2.6.9 2-1.8.7-3.7-.1-4.2-.7-2.1.5-.9 1.6-1.8.2-2.2-1.4-6.3 3.2-2.6-.6-.8.5-1.6 3.9-4.3-1.3-4.1-.6-3.6-2.4-4.7-2.2-3 2.1-2.2 3.2-.5 4.5-3.6-.3-3.9-1.1-3.3 3.4-3 6-.6-1.9-.3-2.9-2.6-2.1-2.1-3.3-.5-2.3-2.7-3.4.5-1.9-.6-2.7.4-5 1.4-1.1 2.8-6.5 4.6-.5 1-1.7 1 .2 1.4 1.4 7.1-2.4 2.4-2.5 2.9-2.3-.6-2.2 1.6-.6 5.5.4 5.2-3 4-7 2.8-2.6 3.6-1.1.7 2.7 3.3 4v2.7l-.8 2.6.4 2 1.9 1.9.5.3z" />
//     <Path
//       d="m665.9 203.6 3.4.9 4.7-.2-3.3 2.6-2 .4-5.5-2.7-.6-2.1 2.5-1.9.8 3ZM680.3 187.6l-2.4.1-5.8-1.9-3.5-3 1.9-.5 5.9 1.6 4.2 2.6-.3 1.1ZM372.4 191.3l-3.1.9-6.3-2.8v-2.2l-2.9-2.2.3-1.8-4.3-1.1.6-3.4 1.5-1.4 4.1 1.3 2.4 1 4.1.6.2 2.2.4 2.9 3.2 2.6-.2 3.4ZM711.5 177.8l-5 5.4 3.9-2.1 2.9 1.4-2.4 2.1 3.8 1.7 2.8-1.5 4.3 1.9-2.8 4.6 3.8-1.1-.3 3.3.5 3.9-3.6 5.6-2.4.2-2.9-1.2 2.5-5.1-1.2-.8-7.3 5.4-3-.2 4.4-3-4.4-1.5-5.5.4-9.6-.2-.2-1.8 3.8-2.3-1.7-1.6 5.4-3.8 8.2-9.9 4.2-3.5 5-2.1 2.1.2-1.5 1.7-3.8 3.9ZM351.5 156.4l1.5.8 5-.5-7.2 6.9.3 5h-1.9l-.7-2.8.5-2.9-.8-1.9 1.3-2.7 2-1.9ZM634.9 108.9l-3.6 3-1.7-.5-.1-1.7.4-.4 2.8-1.7 1.7.1.5 1.2ZM625.2 105.7l-7.2 3.2-3-.2v-1.5l5-2.7 6 .1-.8 1.1ZM622.1 88.9l-.9 2.5 2.7-.9 1.5 1.5 3.5 2 3.8 1.7-1.4 2.7 3.5-.4 1.9 1.9-5 1.8-5.9-1.4-.8-2.6-6.3 3.1-8.2 2.9.7-3.3-6.3.5 5.7-2.8 3.6-4.5 5.1-5.1 2.8.4ZM667 80.6l-4.9.3.7-2.7 3.8-3.1 4.3-.7 2.3 1.5-1.5 2.3-.9.8-3.8 1.6ZM592.5 69.9l-4.1 1.9-4.2-1.6-3.9.5-3.4-2.4 5-1.7 4.9-2.3 3 1.5 1.6 1 .4 1 .7 2.1Z"
//       className="Canada"
//     />
//     <Path
//       d="m645.5 212.5-2.2-3.6 2.9-8.5-1.6-1.8-3.7 1-1.1-1.6-5.5 4.7-3.2 4.9-2.8 2.9-2.5 1-1.7.3-1.1 1.5h-9.3l-7.8.1-2.7 1.1-6.8 4.4v-.1l-.9-.4-2 .9-1.9 1.3-1.8-1.1-4.7.8-3.9.9-1.9.8-2.3 2.1 1.8.7 1.7-.4h.3l-.3 1.9-4.8.7-2.8.8-1.7 1-2.6-.6-1.6.3-2.9 1.8-4.6 2-2.7-.4 2-2.2 3.7-3.5 4.1-2.1 1.1-1.8.9-3 3.8-3.5.9-4 1.1 3.9 3.8.9 2.4-2.1-1.4-4.8-.9-2-4-1.2-3.8-.7h-3.9l-3.4-.8-.4-1.4-1.4.9-1.2-.2 1.9-2.1-1.8-.8 1.9-2.4-1.2-1.8 1.7-1.8-5.2-.9-.1-3.6-.8-.8-3.3-.2-4.1-1.2-1.5.8-1.8 1.5-3.3 1-3.1 2.5-5.4-1.7-4.4.8-3.9-1.9-4.6-1-3.3-.4-1-1 .9-3.4h-1.7l-1.3 2.4H377l-5.4-6.1-1.6-2.7-7-2.6 1.3-5.5 3.6-3.7-4.1-2.7 3.1-4.9-2.1-4.4 2.5-3.2 5.1-2.9 3.2-3.8-4.6-3.8 1.4-6.9 1.1-4.2-1.6-2.7-.8-2.4.6-3.1-6.5 1.9-7.6 3.3-.3-3.8-.5-2.6-2.8-1.6-4.2-.2L385.4 87 410 66.6l6 1.3 3.3 2.6 3.7.5 6.3-2.2 7-1.7 5.3.6 8.9-2.3 8.2-1.3.2 2.2 4.5-1.3 3.9-2.5 2.1.6 1.4 4.8 9.5-3.7-3.9 4.1 6-.9 3.2-1.5 4.6.3 3.9 2.2 7.5 2 4.7.9 4.4-.3 2.9 2.8-8.5 2.7 6.4 1.1 11.9-.6 4.4-1 1.4 3.3 7.1-2.7-2.1-2.4 4.5-1.8 5.2-.3 3.9-.5 2.1 1.3 1.5 2.9 5-.4 5.3 2.5 7.2-.9 6 .1 2.4-3.4 4.5-.9 4.9 1.8-4.3 5.2 6.2-4.4 3.2.2 6.4-5.5-1.6-3.3-2.9-2.2 5.5-5.9 8.2-3.8 4.5.9 2 2.3.4 6-5.8 2.6 6.7 1.1-4.4 5.5 8.9-4.2 2.2 3.5-4.3 4 1.3 3.7 7.3-3.9 6.5-4.8 4.7-5.9 5.5.4 5.4.8 3.6 2.7-1.7 2.7-5.1 2.9.9 2.9-2.4 2.7-10.9 3.9-6.5.9-3.2-1.7-3.3 2.8-7.4 4.7-3 2.5-7.7 3.8-6.5.4-5.1 2.4-2.9 3.8-5.7.7-8.7 4.7-9.4 6.5-5 4.6-4.9 6.9 6 1-1.5 5.5-.8 4.6 7.3-1.2 7 2.6 3.3 2.3 1.7 2.8 4.9 1.7 3.6 2.5 7.6.4 4.8.6-3.6 5.2-1.7 6.1.1 6.9 4.4 5.9 4.7-2 5.6-6.4 2.3-9.6-1.7-3.2 9-2.9 7.5-4.2 4.8-4.2 1.7-4-.4-5.1-3.2-4.5 8.9-6.2 1-5.3 3.9-9 3.8-1.4 6.7 1.6 4.2.6 4.5-1.6 3.1 2 3.6 3.4.2 2.2 7.7.5-2.6 4.9-2.3 7.4 3.8 1 1.6 3.5 8.2-3.3 7.5-6.6 4.2-2.7 1.1 5.3 2.6 7.5 2 7.2-3.4 3.8 4.8 3.4 2.9 3.4 6.9 1.6 2.4 1.9v5.2l3.4.8 1.1 2.3-2 6.9-4.3 2.3-4.2 2.2-8.8 2.2-7.9 5-8.6 1.1-10.1-1.4h-7.3l-5.3.4-5.7 4.5-7.4 2.8-10.1 8.2-7.9 5.8 4.7-1 10.9-8.3 12.3-5.2 7.6-.6 3.3 3.1-6.1 4.2-.6 6.7.1 4.8 5.6 3.1 8.6-.9 7.2-7.1-1 4.6 2.5 2.3-7.4 4.1-12.4 3.8-5.8 2.5-7.2 4.6-3.7-.5 1.5-5.3 10.4-5.3-8.1.2-5.9.8Z"
//       className="Canada"
//     />
//     <Path
//       d="m539 48.7-4.7 2.4 10.5-1.5 2.6 2.6 7.3-2.7 1.8 1.7-2.2 5.1 4.3-2.1 2.8-5.3 4.3-.8 3 .8 2.2 2.1-2.7 5.1-2.4 3.7 4.2 2.6 5 2.6-2.6 2.3-7.1.5.8 2-3.2 2-6.7-.8-5.7-1.5-5.1.3-9.5 1.9-11.3.8-7.9.5.3-2.6-4.1-1.4-4.3.6-.6-4.3 3.3-.6 7.3-.9 5.5.3 6.2-1-6.5-1.2-9.1.4-5.7-.1v-1.9l11.7-2.2-6.3.1-5.4-1.4 7.8-3.9 5.2-2.1 14.2-3.1 2.8 1ZM578.5 47.2l-7 3.4-2.3-3.6 2.1-.8 5.5-.2 1.7 1.2ZM687.1 48.8l-.7 1.4-4.1-.1-4.1-.1-4.9.7-.9-.4-2.1-2.7 1.7-1.8 2.2-.4 8.4.6 4.5 2.8Z"
//       className="Canada"
//     />
//     <Path
//       d="m647.3 48.5.3 3.2 7.2-4.1 11.7-2.1 2.3 5.3-3.2 3.4 9-1.5 5.3-2.1 6.8 2.6 3.7 2.5-1.1 2.3 8.2-1.2 1.9 3.4 8.4 2.1 2.2 2.1.9 5.1-9.1 2.5 7.7 3.6 5.9 1.2 3.3 5 6.5.4-3.3 3.9-10.9 6.5-4-2.4-3.8-5.4-5.9.7-2.3 3.3 2.7 3.2 4.5 2.6 1 1.5-.1 5.7-3.6 4.1-4.7-1.6-8.6-4.5 3.6 4.9 2.8 3.5-.3 2-10.9-2.3-7.6-3.4-3.8-2.7 2.4-1.7-4.8-2.9-4.7-2.7-.9 1.6-13.1.9-2.4-1.9 5.4-4.2 8.1-.1 9.3-.7-.2-2 3.1-2.8 8.8-5.4.4-2.5-.5-1.8-4.7-2.7-7.1-1.8 3.5-1.4-2-3.4-3.4-.3-1.9-1.8-3.3 1.6-7.9.7-14-1.2-7.4-1.6-5.9-.8-1.9-1.9 6.3-2.4h-5.7l3.3-5.3 7.1-4.6 6-2.1 11.2-1.4-5.8 3.3ZM596.9 45l3.6 1.1 7.6-.7-.5 1.5-6.1 2.5 3.8 2.2-5.2 4.7-8.4 2-3.4-.4-.9-2-5.9-4 1.7-1.7 7.4.6-.9-3.3 7.2-2.5ZM619.5 50.5l-7.8 3.9-4.4-.2 1.8-4.6 2.6-2.5 4.2-2.2 5.2-1.4 7.9.2 6.2 1.2-10.1 4.6-5.6 1ZM503.7 57.7l-13.5 2.6.6-2.3-6-2.8 4.4-2.2 7.5-3.8 7.6-3.4.4-3.1 14-.8 4.2 1.1 9.5.3 1.9 1.4 1.6 2.2-6.5 1.3-13.9 3.6-9.2 3.7-2.6 2.2ZM628.9 39.3l-4.1 1.9-5.2-.4-3.2-1.3 4.5-2.2 6.9-1.4 1.4 1.8-.3 1.6ZM620.1 30.6l.2 2.3-2.8 2.5-5.8 3.8-6.9.5-3.2-.8L605 36l-6.6.3 4.3-3.8 3.8.2 7.7-1.7 4.9.3 1-.7ZM580.7 33.2l-.7 1.7 4.4-.8 3.6.2-2.3 2.5-5.1 2.3-13.9.8-12.3 2.2-6 .1 1.5-1.6 10.7-2.3-17.9.6-4.2-.9 11.7-4.8 5.4-1.4 8.3 1.7 2.9 2.9 6.1.4.7-4.7 5.8-1.8 3.1.5-1.8 2.4ZM636.4 28.8l2.3 1.6h7.4l1.4 1.6-2.8 1.8 3.1 1.1 1.2 1.2 4.9.2 5.1.4 7.1-1 8.1-.5 5.8.4 2.3 1.9-1 2-3.6 1.4L671 42l-4.3-.7-11.8.8-8 .1-5.6-.6-8.6-1.6 1.6-2.8 2.1-2.4-1.4-2.2-7-.6-2.6-1.5 3.8-2 7.2.3ZM560.7 26.2l-5.8 3.7-5.3 1.7-3.8.2-9.9 2.1-7.1.8-3.6-1.1 11.7-3.7 12.2-3.1 5.5.1 6.1-.7ZM641.9 26.8l-1.8.1-6.6-.3.7-1.3 7.2.1 1.6.8-1.1.6ZM583.1 25.9l-8.8 1.4-3.3-1.5 5.1-1.5 6-.5 4.1.7-3.1 1.4ZM590.9 21.7l-5.7.9h-6l1-.7 5.7-1.3 1.7.2 3.3.9ZM637.7 24.2l-6.6 1-1.6-1.1.6-1.7 2.2-1.9 4.4.2 1.7.3 2.3 1.6-3 1.6ZM623.9 23l-1.1 1.9-5.3-.5-4-1.5-7.8-.2 5.3-1.3-2.8-1.1 2.2-1.8 6.1.6 7.5 1.7-.1 2.2ZM678 16.9l2.7 1.5-6.5 1.3-10.6 3.5-6.8.3-6.8-.6-1.6-1.9 2.1-1.6 4.3-1.2h-6.6l-2-1.5.4-1.9 4.9-1.9 4.1-1.3 4-.3-.3-1 8.3-.2 1.6 2.2 4.7.9 4.8.9-.7 2.8Z"
//       className="Canada"
//     />
//     <Path
//       d="m757.2 2.9 8.7.3 6.7.5 5.2 1-1.1 1-9.8 1.7-9 .8-4 .9h7.5l-10.5 2.5-6.8 1.2-9.3 3.5-8.1.7-3.1 1-11.3.4 4.4.6-3.3.8.7 2.3-5 1.6-6.9 1.3-3.5 1.8-6.6 1.5-.5 1.1 6.5-.2-1.1 1.2-12.7 2.9-8.5-1.4-11.7.8-5-.6-6.8-.3 2.1-2.3 8-1.1 2-3.4 2.6-.3 7.5 2-1.7-3-4.9-.9 5-1.8 7.6-1.1 2.8-1.6-3-1.7 1.1-2.2 9.4.1 2.2.5 7.3-1.6-7.3-.5-12.6.3-4.4-1.4-.8-1.7-2.5-1.2 1.1-1.3 6-.8 4.2-.1 7.4-.6 6.8-1.5 3.9.2 2.4 1.1 5-2 5.2-.6 6.5-.4 10.4-.2 1.3.4 10.3-.6 7 .2 7 .2Z"
//       className="Canada"
//     />
//     <Path d="m1034.4 197.5.2 1.1-.7 1.5 2.3 1.2 2.6.2-.3 2.5-2.1 1.1-3.8-.8-1 2.5-2.4.2-.9-1-2.7 2.2-2.5.3-2.2-1.4-1.8-2.7-2.4 1v-2.9l3.6-3.5-.2-1.6 2.3.6 1.3-1.1h4.2l1-1.3 5.5 1.9z" />
//     <Path
//       d="m1602.2 381.9-4.3 3.1-4.9-2-1-5.5 2.2-2.9 5.8-1.8 3.3.1 1.6 2.5-2 2.8-.7 3.7ZM1625.6 185.5l9 4.5 6 5.8h7.6l2.6-2.4 6.9-1.9 1.3 5.7-.3 2.3 2.8 6.8.6 6.2-6.9-1.1-2.9 2.2 4.7 5.4 3.9 7.5-2.5.1 1.9 3.3-5.5-3.8v3.6l-6.4 2.7 2.8 3.4-4.6-.3-3.6-2-1.1 4.6-3.9 3.4-2.1 4.1-6.3 1.8-2.4 3-4.8 1.8 1.3-3-2.3-2.5 2-4.3-4.5-3.3-3.4 2.2-3.6 4.5-1.3 4.1-5 .3-1.3 3 4.8 4.3 4.8 1.1 1.4 2.8 5.1 1.9 3.8-4.6 5.9 2.5 3.5.2 2.3 3.3-6.7 1.8-1 3.5-3.8 3.2-.9 4.5 7.1 3.5 4.6 6.3 5.5 5.9 5.5 4.9 1.6 4.8-2.8 1.8 2.4 3.4 3.9 2 .8 5.2.1 5.1-2.8.6-2.1 6.9-2.3 8.5-3.4 7.6-6.4 5.9-6.6 5.5-6.1.7-2.9 2.8-2.3-2-2.5 3.1-7.2 3.3-5.8.9-.7 6.8-3.1.4-2.2-4.7.9-2.4-7.8-2.1-2.4 1.1-5.9-1.7-3.1-2.6.3-3.7-5.3-1.2-3.1-2.4-4.1 3.4-5.3.8-4.4-.1-2.7 1.6-2.7.9 2 7.4-3-.2-.8-1.5-.5-2.7-3.8 1.9-2.6-1.2-4.5-2.4.8-5.3-3.7-1.3-2.4-5.9-5.6 1.1-.7-7.6 4.2-5.4-.9-5.3-1.3-4.9-2.7-1.5-2.7-3.8-3.1.5-6.1-1 1.2-2.7-3.6-4-3.2 2.7-4.9-1.5-5.4 4-3.9 4.8-4.2.8-2.8-1.7-2.9-.2-4.3-1.4-2.6 1.6-2.6 4.8-1.5-5.1-3.1 1.4-6.5-.7-6.5-1.4-5-2.9-4.5-1.2-2.5-3.1-3.3-.9-6.4-4.2-4.8-2-1.9 1.5-8.6-4.5-6.2-4-3.2-7.1 4.1.9-.6-3.3-3-3.3-.8-5.2-7.7-7.6-9.5-2.5-2.9-5-4.7-3-1.5-1.8-1.8-3.6-.5-2.5-3.7-1.5-1.5.7-3.1-6 1.1-1.4-1.2-1.5 4.1-3 3.2-1.3 5.8.9.6-4.1 6.4-.7 1-2.6 6.9-3.4.2-1.4-1.7-3.7 2.9-1.6-8.8-11 9.1-2.5 2-1.4-1-11.3 10.8 2.1 1.6-2.9-2.5-6.2 3.8-.6 1.9-4.2 1.7-.5 3.3 4.4 5.7 3.3 8.2 2.3 5.8 5.1 1.4 7.3 3 2.8 6.5 1.1 7.2.8 8 4 3.4.7 5 5.8 4.7 3.8 5.6-.2 11.3 1.5 6.4-.9 5.6.9 9.4 3.9h6.2l3.3 1.9 4.4-3.4 7.2-2.2 7.6-.2 4.9-2.2 2-3.4 2.4-2.2-1.9-2.1-2.9-2.4.5-4.1 3.2.6 5.9 1.3 3.2-3.4 6.4-2.4 1.3-4.2 2.5-1.8 6.8-.8 4.4.7-.8-2.2-7.2-4.4-5.2-2-2.5 2.3-5.5-1-2.3.8-2.8-2.5-.3-6.3-.6-4.7 7.4 2.4 4.4-3.9-1.9-2.8-.2-6.5 1.3-2-2.5-3.4-3.7-1.4 1.7-3.1 5.1-1.1 6.2-.2 8.6 1.9 6 2.2 7.7 6.2 3.8 2.7 4.5 3.8 6.2 6 10 2Z"
//       className="China"
//     />
//     <Path d="m955.9 435.2 2.5 1.4 1 2.2 2.5 1.3 2-1.6 2.6-.2 3.9 1.6 1.5 9.2-2.4 5.3-1.5 7.3 2.4 5.5-.2 2.6h-2.6l-3.9-1.2H960l-6.7 1.2-3.9 1.8-5.6 2.4-1.1-.2.4-5.3.6-.8-.2-2.5-2.4-2.7-1.8-.4-1.6-1.8 1.2-2.9-.5-3.1.2-1.8h.9l.4-2.8-.4-1.3.5-.9 2.1-.7-1.4-5.2-1.3-2.6.5-2.2 1.1-.5.8-.6 1.5 1h4.4l1-1.8 1 .1 1.6-.7.9 2.7 1.3-.8 2.4-1zM1072.8 454.2l-2.8 6.5-1.4 1.1-.4 5 .6 2.7-.5 1.9 2.7 3.4.5 2.3 2.1 3.3 2.6 2.1.3 2.9.6 1.9-.4 3.4-4.5-1.5-4.6-1.7-7.1-.2-.7-.4-3.4.8-3.4-.8-2.7.4-9.3-.1.9-5.1-2.3-4.3-2.6-1-1.1-2.9-1.5-.9.1-1.8 1.4-4.6 2.7-6.2h1.6l3.4-3.8 2.1-.1 3.2 2.7 3.9-2.2.5-2.7 1.3-2.6.8-3.2 3-2.6 1.1-4.5 1.2-1.5.8-3.3 1.4-4.1 4.7-5 .3-2.1.6-1.2-2.3-2.5.2-2.1 1.5-.3 2.3 4.1.5 4.2-.2 4.3 3.2 5.8h-3.2l-1.6.4-2.6-.6-1.2 3 3.4 3.8 2.5 1.1.8 2.6 1.8 4.4-.8 1.8zM1141.3 468.2l3.5 5.3 2.6.8 1.5-1.1 2.6.4 3.1-1.3 1.4 2.7 5.1 4.3-.3 7.5 2.3.9-1.9 2.2-2.1 1.8-2.2 3.3-1.2 3-.3 5.1-1.3 2.5-.1 4.8-1.6 1.8-.2 3.8-.8.5-.6 3.6 1.4 2.9.1 1-1.2 10.3 1.5 3.6-1 2.7 1.8 4.6 3.4 3.5.7 3.5 1.6 1.7-.3 1.1-.9-.3-7.7 1.1-1.5.8-1.7 4.1 1.2 2.8-1.1 7.6-.9 6.4 1.5 1.2 3.9 2.5 1.6-1.2.2 6.9h-4.3l-2.2-3.5-2-2.8-4.3-.9-1.2-3.3-3.5 2-4.4-.9-1.9-2.9-3.5-.6-2.7.1-.3-2-1.9-.1-2.6-.4-3.5 1-2.4-.2-1.4.6.4-7.6-1.8-2.4-.4-4 .9-3.9-1.1-2.4-.1-4.1-6.8.1.5-2.3h-2.9l-.3 1.1-3.5.3-1.5 3.7-.9 1.6-3.1-.9-1.8.9-3.8.5-2.1-3.3-1.3-2.1-1.6-3.9-1.3-4.7-16.7-.1-2 .7-1.7-.1-2.3.9-.8-2 1.4-.7.2-2.8 1-1.6 2-1.4 1.5.7 2-2.5 3.1.1.3 1.8 2.1 1.1 3.4-4 3.3-3.1 1.4-2.1-.1-5.3 2.5-6.2 2.6-3.3 3.7-3.1.7-2 .1-2.4.9-2.2-.3-3.7.7-5.7 1.1-4 1.7-3.4.3-3.9.5-4.5 2.2-3.2 3-2.1 4.7 2.2 3.6 2.4 4.1.6 4.3 1.3 1.6-3.9.8-.5 2.6.6 6.3-3.2 2.2 1.4 1.8-.2.9-1.6 2.1-.5 4.2.7 3.7.1 1.8-.7z" />
//     <Path d="m1090.9 479.3-.3 3.9-1.7 3.4-1.1 4-.7 5.7.3 3.7-.9 2.2-.1 2.4-.7 2-3.7 3.1-2.6 3.3-2.5 6.2.1 5.3-1.4 2.1-3.3 3.1-3.4 4-2.1-1.1-.3-1.8-3.1-.1-2 2.5-1.5-.7-2.1-2.2-1.7 1.1-2.3 2.8-4.6-6.8 4.3-3.6-2.1-4.2 2-1.6 3.8-.8.4-2.9 3.1 3.1 5 .3 1.7-3 .7-4.3-.6-5-2.7-3.8 2.5-7.5-1.4-1.2-4.2.5-1.6-3.3.4-2.8 7.1.2 4.6 1.7 4.5 1.5.4-3.4 3-6 3.3-3.4 3.9 1.1 3.6.3zM584.4 426.2l-3.7 1.1-1.6 3.2-2.3 1.8-1.8 2.4-.9 4.6-1.8 3.8 2.9.4.6 2.9 1.2 1.5.3 2.5-.7 2.4.1 1.4 1.4.5 1.2 2.2 7.3-.6 3.3.8 3.8 5.6 2.3-.7 4.1.3 3.2-.7 2 1.1-1.2 3.4-1.3 2.2-.6 4.6 1.1 4.3 1.5 1.9.2 1.4-2.9 3.2 2 1.4 1.5 2.3 1.6 6.4-1.1.8-1-3.8-1.6-2.1-1.9 2.3-11-.2v4l3.3.7-.2 2.5-1.1-.7-3.2 1-.1 4.7 2.6 2.4.9 3.6-.1 2.8-2.2 17.6-2.9-3.4-1.7-.1 3.5-6.6-4.4-3-3.4.6-2.1-1.1-3.1 1.7-4.2-.9-3.5-6.7-2.6-1.6-1.8-3.1-3.8-3-1.5.6-2.4-1.5-2.8-2.1-1.6 1-4.8-.9-1.4-2.8-1.1.1-5.6-3.6-.7-2 2.1-.5-.2-3.2 1.4-2.4 2.8-.4 2.5-4 2.2-3.4-2-1.5 1.2-3.7-1.1-5.9 1.3-1.7-.7-5.4-2.2-3.5.9-3.1 1.8.5 1.1-1.9-1.1-3.8.7-.9 2.9.2 4.5-4.5 2.4-.7.1-2.1 1.4-5.5 3.4-2.9 3.5-.2.6-1.3 4.4.5 4.6-3.2 2.3-1.4 2.9-3.1 2 .4 1.3 1.7-1.2 2.1zM514.6 431.6l1.2 3.5 2 2.6 2.5 2.7-2.2.6-.1 2.6 1.1.9-.9.8.2 1.1-.6 1.3-.3 1.3-3-1.4-1.1-1.4.7-1.1-.1-1.4-1.5-1.5-2.2-1.3-1.8-.8-.3-1.9-1.4-1.1.2 1.8-1.2 1.6-1.2-1.8-1.7-.7-.7-1.2.1-2 .9-2-1.5-.9 1.4-1.3.9-.8 3.6 1.7 1.3-.8 1.8.5.8 1.3 1.7.5 1.4-1.4zM544.8 355.7l1.9 2.3 5.2-.7 1.8 1.5 4.2 4 3.2 2.9 1.8-.1 3.2 1.3-.6 1.8 4 .3 3.9 2.6-.8 1.5-3.8.8-3.8.3-3.7-.5-8.1.6 4.2-3.5-2.1-1.7-3.6-.4-1.7-1.9-.8-3.6-3.2.2-5-1.7-1.5-1.4-7.1-1-1.8-1.2 2.3-1.6-5.4-.3-4.4 3.3-2.3.1-1 1.6-2.8.7-2.3-.7 3.2-1.9 1.5-2.4 2.7-1.4 3-1.2 4.3-.6 1.4-.8 4.7.5 4.4.1 4.9 2.2zM1059.7 175.2l2.5 2 3.7.5-.2 1.7 2.8 1.3.6-1.6 3.4.7.7 2 3.7.3 2.6 3.1h-1.5l-.7 1.1-1.1.3-.2 1.4-.9.3-.1.6-1.6.6-2.2-.1-.6 1.4-2.4-1.2-2.3.3-4-1.9-1.7.5-2.6 2.6-3.8-2.1-3-2.6-2.6-1.5-.7-2.7-1-1.8 3.4-1.3 1.7-1.6 3.5-1.2 1.1-1.2 1.3.7 2.2-.6z" />
//     <Path d="m1053.9 158.9 1.4 3.1-1.2 1.7 1.9 2.1 1.5 3.3-.2 2.2 2.4 3.9-2.2.6-1.3-.7-1.1 1.2-3.5 1.2-1.7 1.6-3.4 1.3 1 1.8.7 2.7 2.6 1.5 3 2.6-1.6 2.9-1.7.8 1 4.1-.4 1.1-1.7-1.3-2.4-.2-3.5 1.1-4.4-.3-.6 1.7-2.7-1.7-1.4.3-5.5-1.9-1 1.3h-4.2l.4-4.5 2.4-4.2-7.2-1.2-2.4-1.6.2-2.7-1-1.4.4-4.2-1.1-6.5h2.9l1.2-2.3.9-5.6-.9-2.1.8-1.3 4-.3 1 1.3 3.1-3-1.3-2.3-.4-3.4 3.7.8 2.9-.9.3 2.3 4.9 1.4.1 2.2 4.7-1.2 2.6-1.6 5.6 2.4 2.4 1.9zM1229.5 428.2l-1.9 3.5-1.3-1.2-1.3.5-3.2-.1-.2-2-.5-1.8 1.8-3 1.9-2.8 2.4.6 1.7-1.6 1.4 2-.1 2.6-3.1 1.6 2.4 1.7z" />
//     <Path
//       d="m1046.1 147.7-2.4 4.9-5.2-3.5-.9-2.5 6.8-2 1.7 3.1ZM1033.3 151.5l-2.9.9-3.7-.8-2.1-3.4-.4-6.1.6-1.7 1.3-1.8 4-.3 1.6-1.7 3.6-1.7v3.1l-1.2 2 .7 1.6 2.6.9-1 2.3-1.4-.6-3.1 4.3 1.4 3Z"
//       className="Denmark"
//     />
//     <Path d="m585.7 386 .3-1.8-1.3-1.9 1.5-1.1.7-2.5-.1-3.4.8-1.1h4.3l3.2 1.6 1.5-.1.7 2.3 3.1-.2-.4 1.9 2.5.3 2.5 2.3-2.3 2.6-2.6-1.4-2.6.3-1.8-.3-1.1 1.2-2.2.4-.7-1.6-1.9.9-2.7 4.4-1.3-1-.1-1.8zM1031 264.6l-1 3.3 1 6.1-1.1 5.3-3.2 3.6.6 4.8 4.5 3.9.1 1.5 3.4 2.6 2.6 11.5 1.9 5.7.4 3-.8 5.2.4 3-.6 3.5.6 4-2.2 2.7 3.4 4.7.2 2.7 2.1 3.6 2.5-1.2 4.5 3 2.5 4-18.8 12.3-16 12.6-7.8 2.8-6.2.7-.1-4.1-2.6-1.1-3.5-1.8-1.3-3-18.7-14-18.6-14-20.5-15.6.1-1.2.1-.4.1-7.6 8.9-4.8 5.4-1 4.5-1.7 2.1-3.2 6.4-2.5.3-4.8 3.1-.6 2.5-2.3 7.1-1.1 1-2.5-1.4-1.4-1.9-6.8-.3-3.9-1.9-4.1 5.1-3.5 5.8-1.1 3.3-2.6 5.1-2 9-1.1 8.8-.5 2.7.9 4.9-2.5 5.7-.1 2.2 1.5 3.6-.4zM559 502.8l.8 4.9-1.7 4.1-6.1 6.8-6.7 2.5-3.4 5.6-.9 4.3-3.1 2.7-2.5-3.3-2.3-.7-2.3.5-.3-2.3 1.6-1.5-.7-2.7 2.9-4.8-1.3-2.8-2.1 3-3.5-2.9 1.1-1.8-1-5.8 2-1 1-4 2.1-4.1-.3-2.6 3.1-1.4 3.9-2.5 5.6 3.6 1.1-.1 1.4 2.8 4.8.9 1.6-1 2.8 2.1 2.4 1.5zM1172.1 301.4l3.9 9.4.7 1.6-1.3 2.6-.7 4.8-1.2 3.4-1.2 1.1-2-2.1-2.7-2.8-4.7-9.2-.5.6 2.8 6.7 3.9 6.5 4.9 10 2.3 3.5 2 3.6 5.4 7.1-1 1.1.4 4.2 6.8 5.8 1.1 1.3h-65.9l-1-23.7-1.3-22.8-2-5.2 1.1-3.9-1-2.8 1.7-3.1 7.2-.1 5.4 1.7 5.5 1.9 2.6 1 4-2 2.1-1.8 4.7-.6 3.9.8 1.8 3.2 1.1-2.1 4.4 1.5 4.3.4 2.5-1.6zM1228.9 420.3l-1.7 1.6-2.4-.6-2-2.1-2.5-3.7-2.6-2.1-1.5-2.2-5-2.6-3.9-.1-1.4-1.3-3.2 1.5-3.6-2.9-1.5 4.8-6.6-1.4-.7-2.5 2-9.5.3-4.2 1.7-2 4-1.1 2.7-3.6 3.6 7.4 1.9 5.9 3.2 3.1 8 6.1 3.3 3.6 3.2 3.8 1.8 2.2 2.9 1.9zM1113.7 124.6l.9 1-2.6 3.4 2.4 5.6-1.6 1.9-3.8-.1-4.4-2.2-2.1-.7-3.8 1-.1-3.5-1.5.8-3.3-2.1-1-3.4 5.5-1.7 5.6-.8 5.1.9 4.7-.1z" />
//     <Path d="m1207.3 408.5 3.9.1 5 2.6 1.5 2.2 2.6 2.1 2.5 3.7 2 2.1-1.9 2.8-1.8 3 .5 1.8.2 2 3.2.1 1.3-.5 1.3 1.2-1.2 2.2 2.2 3.6 2.2 3.1 2.2 2.3 18.7 7.6 4.8-.1-15.6 19.3-7.3.3-5 4.5-3.6.1-1.5 2.1h-3.9l-2.3-2.2-5.2 2.7-1.6 2.7-3.8-.6-1.3-.7-1.3.2-1.8-.1-7.2-5.4h-4l-1.9-2.1-.1-3.6-2.9-1.1-3.5-7-2.6-1.5-1-2.6-3-3.1-3.5-.5 1.9-3.6 3-.2.8-1.9-.2-5v-.8l1.5-6.7 2.6-1.8.5-2.6 2.3-5 3.3-3.1 2-6.4.7-5.5 6.6 1.4 1.5-4.8 3.6 2.9 3.2-1.5 1.4 1.3zM1104.1 70.1l.4 3.8 7.3 3.7-2.9 4.2 6.5 6.3-1.7 4.8 4.9 4.2-.9 3.8 7.4 3.9-.9 2.9-3.4 3.4-8 7.4-8 .5-7.6 2.1-7.1 1.3-3.2-3.2-4.7-1.9.1-5.8-3-5.2 1.6-3.4 3.3-3.5 8.8-6.2 2.6-1.2-.9-2.4-6.5-2.6-1.8-2.2-1.8-8.5-7.2-3.7-6-2.7 2.2-1.4 5.1 2.8 5.3-.2 4.7 1.3 3.4-2.4 1.1-4 5.9-1.8 5.8 2.1-.8 3.8zM1060.5 487.3l-.4 2.8 1.6 3.3 4.2-.5 1.4 1.2-2.5 7.5 2.7 3.8.6 5-.7 4.3-1.7 3-5-.3-3.1-3.1-.4 2.9-3.8.8-2 1.6 2.1 4.2-4.3 3.6-5.8-6.5-3.7-5.3-3.5-6.6.2-2.2 1.3-2 1.3-4.7 1.2-4.8 1.9-.3h8.2v-7.7l2.7-.4 3.4.8 3.4-.8.7.4z" />
//     <Path
//       d="m956.7 158.2-3.5-1.2-3 .1 1.2-3.3-.9-3.2 4-.3 4.9 3.8-2.7 4.1Z"
//       className="United Kingdom"
//     />
//     <Path
//       d="m972.6 129.5-5.1 6.5 4.7-.8h5.1l-1.3 4.9-4.3 5.4 4.9.3.3.7 4.2 7.1 3.2 1 2.9 7 1.4 2.4 5.9 1.1-.6 4-2.4 1.8 1.9 3.2-4.4 3.2-6.5-.1-8.4 1.8-2.2-1.3-3.3 2.9-4.5-.7-3.6 2.4-2.5-1.2 7.3-6.5 4.4-1.4-7.6-1-1.3-2.5 5.1-1.9-2.5-3.3 1-4 7.1.6.8-3.6-3.1-3.7-.1-.1-5.7-1.1-1.1-1.6 1.8-2.7-1.5-1.7-2.6 2.9-.1-5.9-2.2-3 1.9-6.2 3.8-4.8 3.6.4 5.6-.5Z"
//       className="United Kingdom"
//     />
//     <Path d="m1215.7 227.9 5.1 1.3 2.1 2.6 3.6 1.5-1.2.8 3.3 3.5-.6.7-2.9-.3-4.2-1.9-1.1 1.1-7 1-5.6-3.2-5.5.3.3-2.7-2.1-4.3-3.4-2.4-3-.7-2.2-1.9.4-.8 4.6 1.1 7.7 1 7.6 3.1 1.2 1.2 2.9-1zM986.5 431.1l-.4 2 2.3 3.3v4.7l.6 5 1.4 2.4-1.3 5.7.5 3.2 1.5 4.1 1.3 2.3-8.9 3.7-3.2 2.2-5.1 1.9-5-1.8.2-2.6-2.4-5.5 1.5-7.3 2.4-5.3-1.5-9.2-.8-4.8.2-3.7 9.8-.3 2.5.5 1.8-1 2.6.5zM921.5 421.9l.3 2.4h.9l1.5-.9.9.2 1.6 1.7 2.4.5 1.5-1.4 1.9-.9 1.3-.9 1.1.2 1.3 1.4.6 1.8 2.3 2.7-1.1 1.6-.3 2.1 1.2-.6.7.7-.3 1.9 1.7 1.9-1.1.5-.5 2.2 1.3 2.6 1.4 5.2-2.1.7-.5.9.4 1.3-.4 2.8h-.9l-1.6-.2-1.1 2.6h-1.6l-1.1-1.4.4-2.6-2.4-3.9-1.4.7-1.3.2-1.5.3.1-2.3-.9-1.7.2-1.9-1.2-2.7-1.6-2.3h-4.5l-1.3 1.2-1.6.2-1 1.4-.6 1.7-3.1 2.9-2.4-3.8-2.2-2.5-1.4-.9-1.4-1.3-.6-2.8-.8-1.4-1.7-1.1 2.6-3.1 1.7.1 1.5-1 1.2-.1.9-.8-.4-2.1.6-.7.1-2.2 2.7.1 4.1 1.5 1.2-.1.4-.7 3.1.5.8-.4zM891.6 417.4l.8-2.9 6.1-.1 1.3-1.6 1.8-.1 2.2 1.6h1.7l1.9-1 1.1 1.8-2.5 1.5-2.4-.2-2.4-1.3-2.1 1.5h-1l-1.4.9-5.1-.1z" />
//     <Path d="m909.2 421-.1 2.2-.6.7.4 2.1-.9.8-1.2.1-1.5 1-1.7-.1-2.6 3.1-2.9-2.6-2.4-.5-1.3-1.8.1-1-1.7-1.3-.4-1.4 3-1 1.9.2 1.5-.8 10.4.3zM1050.3 487.3v7.7h-8.2l-1.9.3-1.1-.9 1.9-7.2 9.3.1z" />
//     <Path
//       d="m1112.7 272.6 3.1 2.2 4.1-.4 4 .4v1.2l2.8-.8-.5 1.9-7.6.5-.1-1-6.6-1.3.8-2.7ZM1121.9 239.9l-3.2-.2-2.7-.6-6.2 1.6 4 3.6-2.5 1.1h-2.9l-3.1-3.3-.9 1.4 1.6 3.8 2.9 3-1.9 1.4 3.2 2.9 2.8 1.9.4 3.6-5-1.7 1.8 3.3-3.3.6 2.5 5.7-3.5.1-4.6-2.8-2.4-5.1-1.3-4.3-2.3-2.9-3-3.7-.5-1.8 2.2-3.1.1-2.1 1.7-.9-.1-1.7 3.4-.5 1.8-1.4 2.8.1.8-1.1 1-.2 3.8.2 4-1.8 3.9 2.3 4.6-.6-.3-3.2 2.7 1.7-1.1 4-1.2.7Z"
//       className="Greece"
//     />
//     <Path d="m896.3 1.4 19.9 3-6.7 1.4-13 .2-18.5.4 1.4.7 12.3-.5 9.7 1.4 7-1.2 2.4 1.4-4.5 2.4 9.2-1.6 17.1-1.5 10 .8 1.7 1.7-14.8 2.9-2.2 1-11.4.8 8.1.2-4.9 3.2-3.6 2.9-1.2 5.2 3.7 3.2-5.9.1-6.5 1.6 6.3 2.6-.1 4.2-4.2.5 4.1 4.3-8.7.4 4 2-1.6 1.8-5.7.8-5.5.1 4.2 3.4-.5 2.4-7.3-2.2-2.4 1.4 5 1.3 4.6 3.2.6 4.3-7.4 1-2.7-2.1-4.2-3 .5 3.6-5.4 2.8 10.7.2 5.5.3-11.9 4.7-12.2 4.3-12.7 1.8-4.6.1-4.9 2.1-7.5 5.8-10.2 3.9-3 .3-6.1 1.3-6.6 1.4-4.8 3.4-1.4 4-3.4 3.8-8.6 4.6.3 4.5-3.6 4.8-4.1 5.7-6.5.4-5-4.8-9-.1-3.2-3.2-.8-5.6-4.8-7.2-.7-3.7 1.5-5.1-3.7-5.1 3.3-4.1-1.9-2 7-6.4 7.2-2.1 2.6-2.2 2.8-4.2-5.5 1.9-2.6.8-4.1.7-4.2-1.7 1.5-3.7 3-2.8 3.8-.1 7.6 1.5-5.3-3.4-2.7-1.8-4.4.7-2.6-1.3 7-4.8-1.3-2L768 46l-1.4-5.4-3.6-1.9 1.4-2.1-8.1-2.9-7.7-.4-10.1.2-9.5.4-3.1-1.6-3.8-3.1 11-1.5 7.6-.2-14.6-1.3-6.5-1.9 2.2-1.8 15.7-2.2 15-2.2 2.8-1.6-8.1-1.6 4.6-1.7 14.7-2.9 5.4-.4.2-1.8 9-1.1 11-.6h10.4l2.8 1.2 10.6-2.2 7.1 1.5 4.6.3 6.2 1.3-6.7-2.1 1.6-1.7 12.7-2.2 11.6.2 5.1-1.4L870 1l26.3.4zM488.1 387.5l-.7 5.1-1.3 7.2h1.7l1.7 1.2.6-1 1.5.8-2.8 2.5-2.9 1.8-.5 1.2.3 1.3-1.3 1.6-1.4.4.3.8-1.2.7-2 1.6-.3.9-2.8-1.1-3.5-.1-2.4-1.3-2.8-2.6.4-1.9.8-1.5-.7-1.2 3.3-5.2h7.2l.4-2.2-.8-.4-.5-1.4-1.9-1.5-1.8-2.1 2.5-.1.5-3.6h5.2l5.2.1zM662.9 463.5l-1 5.8-3.5 1.6.3 1.5-1.1 3.4 2.4 4.6h1.8l.7 3.6 3.3 5.6-1.3.3-3.2-.6-1.8 1.7-2.6 1.1-1.8.3-.6 1.3-2.8-.3-3.5-3-.3-3-1.4-3.3 1-5.4 1.6-2.3-1.2-3-2-.9.8-2.9-1.2-1.4-3 .2-3.7-4.8 1.6-1.8v-3l3.5-1 1.4-1.2-1.8-2.4.5-2.3 4.7-3.8 3.6 2.4 3.3 4.1.1 3.4 2.1.1 3 3.1 2.1 2.3z" />
//     <Path d="m519.6 405.5-1.9-.1-.9.9-2 .8h-1.4l-1.3.8-1.1-.2-.9-1-.6.2-.9 1.5-.5-.1-.2 1.4-2.1 1.7-1.2.8-.6.8-1.5-1.3-1.4 1.7h-1.2l-1.3.1-.2 3.2h-.8l-.8 1.5-1.8.3-.8-2-1.7-.6.7-2.6-.7-.7-1.2-.4-2.5.7-.1-.8-1.6-1.1-1.1-1.2-1.6-.6 1.3-1.6-.3-1.3.5-1.2 2.9-1.8 2.8-2.5.6.3 1.3-1.1 1.6-.1.5.5.9-.3 2.6.6 2.6-.2 1.8-.7.8-.7 1.7.3 1.3.4 1.5-.1 1.2-.6 2.5.9.8.2 1.6 1.2 1.5 1.4 1.9 1 1.3 1.7zM1081.5 207.6l1.5 2.5 1.7 1.8-1.7 2.4-2.4-1.4-3.5.1-4.5-1.1-2.3.1-1 1.4-2-1.5-.8 2.6 2.7 3 1.3 1.9 2.5 2.4 2.1 1.4 2.1 2.7 4.8 2.4-.5 1-5-2.3-3.2-2.3-4.8-1.9-4.7-4.6 1-.5-2.5-2.7-.3-2.1-3.3-1-1.4 2.7-1.6-2.1v-2.2l.1-.1 3.6.2.8-1 1.8 1 2 .1-.1-1.7 1.7-.7.3-2.5 3.9-1.7 1.6.8 4 2.7 4.3 1.2 1.8-1zM586.8 375.3l.1 3.4-.7 2.5-1.5 1.1 1.3 1.9-.3 1.8-3.6-1.1-2.7.4-3.4-.4-2.7 1.2-2.8-2 .7-2.1 5.1.9 4.1.5 2.2-1.4-2.3-2.8.4-2.5-3.5-1 1.5-1.7 3.4.2 4.7 1.1z" />
//     <Path d="m1096.2 191.9 3 1.7.5 1.7-2.9 1.3-1.9 4.2-2.6 4.3-3.9 1.2-3.2-.3-3.7 1.6-1.8 1-4.3-1.2-4-2.7-1.6-.8-1.2-2.1-.8-.1 1.3-4-1.1-1.4h2.8l.2-2.6 2.7 1.7 1.9.6 4.1-.7.3-1.3 1.9-.2 2.3-.9.6.4 2.3-.8 1-1.5 1.6-.4 5.5 1.9 1-.6z" />
//     <Path
//       d="m1667.5 567.6-2.4.1-7.1-4.5 5.4-1.3 2.8 2 1.8 1.9-.5 1.8ZM1692.3 558.9l.5 1.3-.1 1.9-4.1 4.8-5 1.4-.6-.7.7-2.2 2.8-3.9 5.8-2.6ZM1652.7 553.8l1.9 1.7 3.6-.5 1.2 2.7-6.7 1.3-3.9.9-3.1-.1 2.2-3.7h3.2l1.6-2.3ZM1681 553.8l-1.1 3.6-8.6 1.8-7.5-.8.2-2.4 4.6-1.3 3.4 1.9 3.8-.5 5.2-2.3ZM1600.8 545.3l10.8.7 1.4-2.7 10.3 3.1 1.8 4.2 8.4 1.2 6.7 3.8-6.6 2.4-6.1-2.6-5.1.2-5.8-.5-5.2-1.1-6.4-2.5-4.1-.6-2.4.8-10.2-2.7-.8-2.7-5.1-.5 4.2-6.1 6.8.4 4.4 2.5 2.4.5.6 2.2ZM1748.7 541.7l-3.2 4.4-.2-4.8 1.1-2.3 1.3-2.2 1.2 1.9-.2 3ZM1707.3 524l-2.2 2.2-3.8-1.2-1-2.8 5.7-.3 1.3 2.1ZM1725.7 521.7l1.8 4.9-4.6-2.7-4.7-.5-3.3.4-3.9-.2 1.5-3.5 7-.3 6.2 1.9Z"
//       className="Indonesia"
//     />
//     <Path
//       d="m1785.5 518.5-1 20.9-1.6 21-4.6-5.3-5.6-1.3-1.5 1.8-7.2.2 2.8-5.2 3.7-1.8-1-7-2.3-5.3-10.7-5.5-4.6-.5-8.3-6-1.8 3.2-2.2.5-1.1-2.3.1-2.8-4.2-3.2 6.2-2.3 4 .1-.4-1.7h-8.3l-2.2-3.8-5-1.2-2.3-3.2 7.6-1.5 2.9-2.1 9.1 2.6.9 2.4 1.3 10.4 5.7 3.8 5-6.8 6.6-3.8h5l4.8 2.2 4.1 2.3 6.1 1.2ZM1696.4 492.7l-4.5 6.4-4.3 1.2-5.4-1.2-9.5.3-4.9.9-.8 4.9 5 5.7 3.1-2.9 10.6-2.2-.5 2.9-2.5-.9-2.5 3.8-5.1 2.5 5.1 8.2-1.1 2.2 4.8 7.4-.3 4.2-3.1 1.9-2.1-2.3 3-5.2-5.7 2.5-1.3-1.8.8-2.5-3.9-3.8.7-6.2-3.9 1.9.2 7.5-.2 9.2-3.7.9-2.3-1.8 1.9-5.9-.6-6.2-2.4-.1-1.6-4.4 2.5-4.2.9-5.1 3-9.7 1.1-2.6 4.8-4.8 4.5 1.9 7.1.9 6.5-.3 5.6-4.6 1 1.4ZM1716 494.6l-.3 5.6-2.9-.7-.9 3.9 2.3 3.4-1.6.8-2.2-4.1-1.7-8.2 1-5.1 1.8-2.3.5 3.5 3.4.5.6 2.7ZM1608 488.9l1 4.3 3.9 3.7 3.7-1.3 3.6.4 3.3-3.2 2.7-.6 5.4 1.8 4.6-1.4 2.6-8.9 2.1-2.2 1.7-7.3h6.5l5 1.1-3 5.8 4.4 6-.9 3 6.4 5.9-6.7.8-1.8 4.4.2 5.8-5.5 4.4-.4 6.4-2.5 9.8-.7-2.3-6.6 2.9-2.1-3.9-4-.4-2.8-2.1-6.8 2.4-1.9-3.2-3.8.4-4.6-.7-.6-8.6-2.8-1.8-2.7-5.5-.8-5.6.6-6 3.3-4.3ZM1585.2 539.4l-6.2.1-4.5-5.3-7.1-5.3-2.3-3.9-4.1-5.2-2.7-4.8-4.2-9-4.9-5.4-1.7-5.5-2.2-5-5.2-4-3.1-5.5-4.4-3.6-6.2-7.1-.6-3.3 3.6.3 8.9 1.2 5.2 6.3 4.6 4.4 3.2 2.6 5.5 6.9 5.8.1 4.8 4.4 3.4 5.4 4.3 3-2.3 5.2 3.3 2.2 2 .2.9 4.5 1.9 3.5 4.1.6 2.6 4.1-1.7 8-.7 9.9Z"
//       className="Indonesia"
//     />
//     <Path d="m1427.6 308-2.8 3-.9 6 5.8 2.4 5.8 3.1 7.8 3.6 7.7.9 3.8 3.2 4.3.6 6.9 1.5 4.6-.1.1-2.5-1.5-4.1-.2-2.7 3.1-1.4 1.5 5.1.4 1.2 5.5 2.5 3.2-1 4.7.4 4.5-.2-.5-3.9-2.6-2.1 4.2-.8 3.9-4.8 5.4-4 4.9 1.5 3.2-2.7 3.6 4-1.2 2.7 6.1 1 1 2.4-1.7 1.2 1.4 3.9-4.2-1.1-6.2 4.4.9 3.7-2 5.4.3 3.1-1.6 5.3-4.6-1.5.9 6.7-1 2.2 1 2.7-2.5 1.5-4.4-10.2h-1.5l-.3 4.2-3.6-3.4 1.2-3.6 2.4-.4 1.6-5.4-3.4-1.1-5.1.1-5.4-.9-1.2-4.5-2.7-.3-4.9-2.8-1.2 4.4 4.6 3.4-3 2.4-.9 2.3 3.7 1.7-.3 3.9 2.6 4.8 1.6 5.3-.5 2.4-3.8-.1-6.6 1.3.9 4.8-2.4 3.8-7.5 4.4-5.3 7.5-3.8 4.1-5 4.2.3 2.9-2.6 1.6-4.8 2.3-2.6.3-1.2 4.9 1.9 8.4.7 5.3-1.9 6.1.7 10.9-2.9.3-2.3 4.9 1.9 2.2-5.1 1.8-1.7 4.3-2.2 1.9-5.6-6-3.1-9-2.5-6.5-2.2-3-3.4-6.2-2-8-1.4-4-5.9-8.8-3.5-12.5-2.6-8.2-.8-7.8-1.7-6-7.7 3.9-4-.8-8.1-7.8 2.4-2.3-1.9-2.5-7.1-5.5 3.2-4.3h12.1l-1.8-5.5-3.5-3.2-1.4-5-4-2.8 4.9-6.8 6.5.5 4.5-6.7 2.2-6.5 3.9-6.5-1-4.6 3.8-3.7-5.1-3.1-2.9-4.4-3.3-5.6 2-2.8 8.5 1.6 5.7-1 3.8-5.4 7.7 7.6.8 5.2 3 3.3.6 3.3-4.1-.9 3.2 7.1 6.2 4 8.6 4.5zM956.7 158.2l.7 4.4-3.9 5.5-8.8 3.6-6.8-.9 4.3-6.4-2.1-6.2 6.7-4.8 3.7-2.8.9 3.2-1.2 3.3 3-.1 3.5 1.2zM1229 253.2l1.8-.2 5.3-4.7 1.9-.5 1.9 1.9-1.2 3.1 3.9 3.4 1.3-.4 2.5 4.8 5.3 1.3 4.3 3.2 7.7 1.1 8-1.7.2-1.5 4.4-1.2 3-3.7 3.6.2 2-1.2 3.9.6 6.6 3.3 4.3.7 7.3 5.6 4 .3 1.7 5.3-.6 8-.5 4.7 2.5 1-1.6 3.5 2.7 5.1 1.2 4.1 4.3 1.1 1.1 4.1-3.9 5.8 3.2 3.4 2.8 3.9 5.7 2.8 1 5.6 2.7 1.1.9 2.9-7.5 3.4-1.1 7.4-10.6-1.9-6.2-1.5-6.3-.8-3.3-7.9-2.8-1.1-4.1 1.1-5.1 3.1-7-2.1-6.1-5-5.5-1.8-4.4-6.1-5.2-8.5-2.8 1-3.7-2.1-1.7 2.5-3.5-3.4-.5-3.4h-1.7l.2-4.7-3.5-4.8-7.1-3.6-4.6-6.1.5-5 2.3-2.2-.9-3.7-3.8-2-4.7-7.6-3.8-5.1.7-2-2.9-7.3 3.3-1.9 1.2 2.5 3.2 2.9 3.8.9z" />
//     <Path d="m1223.5 263.2 4.7 7.6 3.8 2 .9 3.7-2.3 2.2-.5 5 4.6 6.1 7.1 3.6 3.5 4.8-.2 4.7h1.7l.5 3.4 3.5 3.4-3.3-.3-3.7-.6-3.3 6.2-10.2-.5-16.8-12.9-8.6-4.5-6.8-1.8-3.1-7.8 11-6.7 1-7.7-1.2-4.7 2.7-1.6 2.1-4 2.1-1 6.3.9 2.1 1.6 2.4-1.1zM924.8 84.5l-1.4 3.6 4.4 3.8-6.1 4.3-13.1 3.9-3.9 1.1-5.6-.9-11.9-1.8L892 96l-9-2.7 7.9-1.1.1-1.7-8.8-1.3 3.6-3.7 6.6-.8 6 3.8 7-3 5.1 1.5 7.3-2.9 7 .4zM1179.1 288.2l.4 2.6-.6 1h.1l-.7 2-2.1-.8-.7 4.2 1.5.7-1.3.9-.1 1.7 2.5-.8.4 2.5-1.8 10.2-.7-1.6-3.9-9.4 1.4-2.1-.4-.4 1.1-3 .6-4.8.6-1.7H1177.3l.4-1.1 1.4-.1z" />
//     <Path
//       d="m1068.2 256.4-1.7 5.1.9 1.9-.9 3.3-4.2-2.4-2.7-.7-7.5-3.2.5-3.3 6.2.6 5.4-.7 4-.6ZM1034.2 237.4l3.3 4.5-.4 8.5-2.4-.4-2.1 2.1-2-1.7-.5-7.7-1.3-3.6 2.9.3 2.5-2Z"
//       className="Italy"
//     />
//     <Path
//       d="m1055.9 203.9-.4 3.1 1.4 2.7-4.1-1-3.9 2.3.4 3.1-.5 1.8 1.9 3.2 5 3.2 2.9 5.3 6.1 5.1 4-.1 1.4 1.4-1.4 1.3 4.8 2.3 4 1.9 4.7 3.4.6 1.1-.8 2.3-3.1-3-4.6-1-1.9 4.1 3.9 2.4-.4 3.3-2.1.4-2.5 5.5-2.2.5-.1-2 .9-3.4 1.1-1.4-2.3-3.7-1.8-3.2-2.2-.8-1.8-2.7-3.4-1.2-2.4-2.6-3.8-.4-4.3-2.8-4.9-4.2-3.7-3.6-1.9-6.3-2.6-.7-4.2-2.1-2.3.8-2.9 3-2.1.4.5-2.7-2.8-.8-1.5-4.9 1.7-1.9-1.5-2.4.1-1.8 2.2 1.4 2.5-.3 2.7-2.2.9 1 2.4-.2 1-2.5 3.8.8 2.1-1.1.3-2.5 3.1.9.5-1.2 4.9-1.1 1.3 2.1 7.3 1.7Z"
//       className="Italy"
//     />
//     <Path d="m556.5 387.1-1.8 1.1-3-1.1-2.9-2.3.8-1.5 2.4-.4 1.3.2 3.7.6 2.7 1.5.8 1.8-4 .1zM1198.1 295.3l-.9 1-10.4 3.2 6 6.5-1.6 1-.7 2.2-4.1.9-1.1 2.3-2.1 2-6.2-1.1-.3-.9 1.8-10.2-.4-2.5.6-1.9-.4-4 .7-2 6.3 2.6 9.7-6.9 3.1 7.8z" />
//     <Path
//       d="m1708.5 282.6 1.6 2.2-1.3 3.9-3.1-2.1-2.1 1.5.1 3.7-4.3-1.8-1.2-3 1.3-3.9 3.4.8 1-2.7 4.6 1.4Z"
//       className="Japan"
//     />
//     <Path
//       d="m1733.1 263.4.6 5.1 2.5 3.2-.6 4.5-5.4 3-9.2.4-4.4 7.4-4.7-2.5-2.4-4.8-8.6 1.4-5.1 3-6.2.2 7.4 4.7.8 10.9-2.5 2.7-3.6-2.5-.9-5.8-4.1-1.8-4-4.4 4.3-2 1.1-4.1 3.9-3.3 2-4.4 9.7-1.9 6.3 1.3v-11.4l5.1 3.1 4.5-6.4 1.7-2.5-1-7.8-5.1-7.2-.2-4 4.8-1.2 8.2 8.9 2.8 5.1-1.3 6.5 3.6 6.6ZM1721.2 218.6l4.5 1.3 1.8-2.6 6 7.1-6.4 1.7-.4 6.3-10.9-4.3 1.6 6.9-5.7.1-4.7-6.3-.6-4.9 5.2-.3-4.4-8.8-1.8-4.9 10.5 6.6 5.3 2.1Z"
//       className="Japan"
//     />
//     <Path d="m1338.3 160.5 4.4-.3 9.2-5.8-.8 2 8.4 4.7 18.3 15.6 1.1-3.2 8.4 3.5 6.2-1.6 3.3 1.1 4.1 3.6 4 1.2 3.3 2.7 6-.9 4.4 3.8-1.9 4.2-3.8.6 2.5 6.2-1.6 2.9-10.8-2.1 1 11.3-2 1.4-9.1 2.5 8.8 11-2.9 1.6 1.7 3.7-3.5-1-3.4-2.3-7.9-.6-8.6-.2-1.6.7-8.2-2.7-2.5 1.4.5 3.7-9.2-2.2-3.1.9-.3 2.8-2.6 1.2-5.4 4.4-.9 4.6h-2l-2.3-3-6.7-.2-2.5-5.2-2.6-.1-1.5-6.4-7.6-4.6-8.6.5-5.7.9-6.6-5.7-4.8-2.4-9.2-4.5-1.1-.5-12 3.7 6.2 23.4-2.6.3-4.8-5-3.9-1.8-5.6 1.3-1.8 2.2-.6-1.6.6-2.6-1.5-2.2-6.5-2.2-3.7-5.7-3.2-1.6-.6-2.1 5.1.6-1-4.6 4.1-1 4.7.9-.7-6.1-1.9-3.9-5 .3-4.7-1.5-5.1 2.7-4.4 1.4-2.8-1.1-.2-3.2-4.3-4.2-3.6.2-5.3-4.2 1.7-4.8-1.8-1.2 2.2-6.9 6 3.6-.6-4.5 8.1-6.7 7.6-.2 12 4.3 6.6 2.5 4.4-2.6 7.7-.1 7.3 3.2.8-1.9 7 .3.2-2.9-9.4-4.3 3.5-3-1.5-1.6 4-1.6-5.1-4.2 1.4-2.1 17-2.1 1.7-1.5 10.9-2.3 3.1-2.5 9.1 1.3 4.4 6.3 4.3-1.5 7.1 2.1 1.1 3.3zM1223.5 476.7l-4.9 7.2.2 23.4 3.3 5.3-4 2.6-1.4 2.7-2.2.4-.8 4.6-1.9 2.6-1.1 4.2-2.3 2.1-8.1-6.4-.3-3.7-20.5-13.1.4-4.7-1.4-2.5v-.3l1.6-2.6 2.8-4.2 2.1-4.7-2.6-7.4-.7-3.2-2.7-4.5 3.4-3.8 3.8-4.2 2.9 1.1.1 3.6 1.9 2.1h4l7.2 5.4 1.8.1 1.3-.2 1.3.7 3.8.6 1.6-2.7 5.2-2.7 2.3 2.2h3.9z" />
//     <Path d="m1400.5 230.2-.2 1.4-6.9 3.4-1 2.6-6.4.7-.6 4.1-5.8-.9-3.2 1.3-4.1 3 1.2 1.5-1.1 1.4-9.6 1-7.1-2.1-5.5.5-.6-3.6 6 1 1.4-1.9 4.1.6 5.3-4.6-7.2-3.4-3.2 1.6-4.6-2.4 3-4.1-1.7-.6.3-2.8 3.1-.9 9.2 2.2-.5-3.7 2.5-1.4 8.2 2.7 1.6-.7 8.6.2 7.9.6 3.4 2.3 3.5 1zM1589.8 410.6l1.8 4.3.1 7.7-9 5 2.8 3.8-5.9.5-4.6 2.6-4.8-.9-2.6-3.4-3.5-6.6-2.1-7.8 3.1-5.3 7.1-1.2 5.3.9 5 2.5 2-4.4 5.3 2.3zM1652.9 259.5v-.6l2.5.2.6-2.8 3.6-.4 2-.4V254l8.3 7.5 3.3 4.2 3.4 7.4-.5 3.5-4.3 1.2-3.1 2.7-4.6.5-2.1-3.5-1.1-4.8-5.3-6.6 3.4-1.1-6.1-5.5zM1247.5 309.4l1.5 2.8-.3 1.5 2.4 4.8-3.9.2-1.7-3.1-5-.6 3.3-6.2 3.7.6z" />
//     <Path d="m1589.8 410.6-5.3-2.3-2 4.4-5-2.5 1.5-2.9-.4-5.4-5.3-5.6-1.3-6.4-5-5.2-4.3-.4-.8 2.2-3.2.2-1.9-1.1-5.3 3.8-1-5.8.4-6.7-3.8-.3-.9-3.9-2.7-2 .8-2.3 4.1-4.2.8 1.5 3 .2-2-7.4 2.7-.9 4 5.1 3.5 5.8h6.8l3 5.6-3.3 1.7-1.2 2.3 7.3 3.9 5.7 7.6 4.4 5.6 4.9 4.5 2 4.5-.2 6.4zM1179.1 288.2l-1.4.1-.4 1.1h-1.8l1.3-5.3 2.2-4.5v-.2l2.5.3 1.2 2.5-2.7 2.5-.9 3.5zM938.6 452.5l-.2 1.8.5 3.1-1.2 2.9 1.6 1.8 1.8.4 2.4 2.7.2 2.5-.6.8-.4 5.3-1.5.1-5.8-3.1-5.2-4.9-4.8-3.5-3.8-4.1 1.4-2.1.3-1.9 2.6-3.4 2.6-3 1.3-.2 1.4-.7 2.4 3.9-.4 2.6 1.1 1.4h1.6l1.1-2.6 1.6.2zM1122.6 299.1l-1.7 3.1 1 2.8-1.1 3.9 2 5.2 1.3 22.8 1 23.7.5 12.8h-6.4v2.7l-22.6-12.3-22.5-12.3-5.5 3.5-3.8 2.4-3.2-3.5-8.8-2.8-2.5-4-4.5-3-2.5 1.2-2.1-3.6-.2-2.7-3.4-4.7 2.2-2.7-.6-4 .6-3.5-.4-3 .8-5.2-.4-3-1.9-5.7 2.6-1.4.4-2.8-.6-2.6 3.6-2.5 1.6-2.1 2.6-1.8.1-4.9 6.4 2.2 2.3-.6 4.5 1.1 7.3 2.9 2.8 5.7 4.9 1.2 7.8 2.7 6 3.2 2.5-1.7 2.5-2.9-1.6-4.9 1.5-3.2 3.7-3 3.7-.8 7.4 1.3 2 2.8 2 .1 1.8 1.1 5.4.7 1.5 2.1zM1445.9 462l-4.8 1.5-2.9-5.1-1.4-9.2 2-10.4 4.1 3.5 2.8 4.5 3.1 6.7-.6 6.7-2.3 1.8zM1139.1 697.9l-2 .7-3.7-5 3.2-4 3.1-2.5 2.7-1.4 2.2 2 1.7 2-1.9 3.1-1.1 2.1-3.1 1-1.1 2zM1111.1 147.6l1 2.7-3.6 2-.5 3.4-4.8 2.3h-4.7l-1.4-1.9-2.5-.7-.6-1.5.2-1.7-2.2-.9-5.1-1.1-1.7-5.1 5.1-1.8 7.9.4 4.5-.6.9 1.2 2.5.4 5 2.9zM1016.9 185.4l-1.4.1-1.1-.5.4-3.5 1.3-.2 1 1.4-.2 2.7z" />
//     <Path d="m1112.8 136.5 2.5 1.3 1 2.9 2.1 3.6-4.6 2.3-2.7 1-5-2.9-2.5-.4-.9-1.2-4.5.6-7.9-.4-5.1 1.8-.5-4.5 1.7-3.8 4.1-2 4.4 4.5 3.7-.2.1-4.6 3.8-1 2.1.7 4.4 2.2 3.8.1zM974.8 276l1.9 4.1.3 3.9 1.9 6.8 1.4 1.4-1 2.5-7.1 1.1-2.5 2.3-3.1.6-.3 4.8-6.4 2.5-2.1 3.2-4.5 1.7-5.4 1-8.9 4.8-.1 7.6h-.9l.1 3.4-3.4.2-1.8 1.5h-2.5l-2-.9-4.6.7-1.9 5-1.8.5-2.7 8.1-7.9 6.9-2 8.9-2.4 2.9-.7 2.3-12.5.5h-.1l.3-3 2.2-1.7 1.9-3.4-.3-2.2 2-4.5 3.2-4.1 1.9-1 1.6-3.7.2-3.5 2.1-3.9 3.8-2.4 3.6-6.5.1-.1 2.9-2.5 5.1-.7 4.4-4.4 2.8-1.7 4.7-5.4-1.2-7.9 2.2-5.6.9-3.4 3.6-4.3 5.4-2.9 4.1-2.7 3.7-6.6 1.8-4 3.9.1 3.1 2.7 5.1-.4 5.5 1.4h2.4zM1129.4 210.3l-1.3-2.9.2-2.7-.6-2.7-3.4-3.8-2-2.6-1.8-1.8-1.6-.7 1.1-.9 3.2-.6 4 1.9 2 .3 2.6 1.7-.1 2.1 2 1 1.1 2.6 2 1.6-.2 1 1 .6-1.3.5-3-.2-.6-.9-1 .5.6 1.1-1.1 2.1-.6 2.1-1.2.7zM1267.9 588.9l.4 7.7 1.3 3-.7 3.1-1.2 1.8-1.6-3.7-1.2 1.9.8 4.7-.7 2.8-1.7 1.4-.7 5.5-2.7 7.5-3.4 8.8-4.3 12.2-2.9 8.9-3.1 7.5-4.6 1.5-5.1 2.7-3-1.6-4.2-2.3-1.2-3.4v-5.7l-1.5-5.1-.2-4.7 1.3-4.6 2.6-1.1.2-2.1 2.9-4.9.8-4.1-1.1-3-.8-4.1-.1-5.9 2.2-3.6 1-4.1 2.8-.2 3.2-1.3 2.2-1.2 2.4-.1 3.4-3.6 4.9-4 1.8-3.2-.6-2.8 2.4.8 3.3-4.4.3-3.9 2-2.9 1.8 2.8 1.4 2.7 1.2 4.3zM449.3 335.9l2.2-.2-3.2 5.7-1.8 4.6-1.8 8.6-1.1 3.1.4 3.5 1.3 3.2.4 4.9 3 4.8.8 3.7 1.7 3.1 5.7 1.7 1.9 2.7 5.2-1.8 4.3-.6 4.4-1.2 3.6-1.1 3.9-2.6 1.8-3.7 1.2-5.4 1.2-1.9 4-1.7 6.1-1.5 4.9.3 3.4-.6 1.2 1.4-.6 3.1-3.5 3.8-1.8 3.9.9 1.1-1.2 2.8-2.1 5-1.2-1.7-1.1.1-1.1.1-2.5 3.9-.9-.8-.7.3-.1 1-5.2-.1h-5.2l-.5 3.6-2.5.1 1.8 2.1 1.9 1.5.5 1.4.8.4-.4 2.2h-7.2l-3.3 5.2.7 1.2-.8 1.5-.4 1.9-5.6-6.9-2.6-2.1-4.4-1.7-3.2.5-4.8 2.4-2.9.6-3.7-1.7-4.1-1.2-4.8-2.9-4.1-.9-5.9-3-4.3-3.1-1.1-1.7-3.1-.4-5.4-2-1.9-2.9-5.4-3.7-2.2-4-.8-3.2 1.9-.6-.3-1.8 1.6-1.7.4-2.2-1.5-2.9v-2.5l-1.3-3.3-3.8-6.4-4.6-5-1.9-4-4.1-2.6-.7-1.6 1.7-3.9-2.4-1.5-2.5-3.2-.2-4.4-2.8-.6-2.3-3.3-1.7-3.2.3-2-1.5-4.8-.3-4.9.8-2.5-3.1-2.6-1.9.3-2.4-1.7-1.8 2.6-.1 3-1 4.9 1 2.6 2.8 4.4.4 1.6.7.4.1 2.2 1-.1v4.2l1.3 1.6.5 2.3 2.7 3.2.4 6 1 2.8.9 3-.3 3.4 2.6.2 1.6 2.9 1.5 2.9-.3 1.2-2.8 2.3h-1l-.7-3.9-2.9-3.7-3.4-3.1-2.5-1.6 1.2-4.7-.1-3.5-2.1-2-3.1-2.8-.9.8-1-1.7-3-1.5-2.2-3.8.5-.4 2.1.3 2.7-2.4 1-2.9-2.9-4.6-2.6-1.7-.8-4-.6-4.3-.8-5.1-.2-5.8 6.3-.5 7.1-.7-.9 1.3 7 3.1 10.9 4.5H399.8l.8-2.7h9.4l1.3 2.3 2.1 2.1 2.4 2.8.8 3.3.4 3.6 2.3 1.9 4 1.9 4.8-5 4.5-.2 3.2 2.6 1.6 4.4.9 3.8 2.4 3.6.2 4.5.9 3 3.9 2 3.6 1.4zM1105.5 236.6l-1 .2-.8 1.1-2.8-.1-1.8 1.4-3.4.5-2.3-1.5-1-2.7.5-2.2.7.1.1-1.3 2.9-1 1.2-.3 1.7-.3 2.4-.2 2.8 2.1.8 4.2zM1010.2 378.8l.1 14.8-3.1 4.3-.4 4-5 1-7.7.5-2 2.3-3.6.3h-3.6l-1.4-1.2-3.1.9-5.3 2.7-1.1 2-4.3 2.8-.8 1.7-2.4 1.3-2.7-.9-1.5 1.6-.9 4.4-4.5 5.3.2 2.2-1.6 2.7.4 3.7-2.4 1-1.3.8-.9-2.7-1.6.7-1-.1-1 1.8h-4.4l-1.5-1-.8.6-1.7-1.9.3-1.9-.7-.7-1.2.6.3-2.1 1.1-1.6-2.3-2.7-.6-1.8-1.3-1.4-1.1-.2-1.3.9-1.9.9-1.5 1.4-2.4-.5-1.6-1.7-.9-.2-1.5.9h-.9l-.3-2.4.3-2-.5-2.4-2-1.8-1.1-3.7-.2-4 1.9-1.2 1-3.8 1.8-.1 3.9 1.8 3.2-1.3 2.1.4.9-1.4 22.5-.1 1.3-4.5-1-.8-2.5-27.7-2.4-27.7 8.5-.1 18.6 14 18.7 14 1.3 3 3.5 1.8 2.6 1.1.1 4.1 6.2-.7zM1548.4 364.2l-4.1 4.2-.8 2.3-3 1.5-2.8 2.8-3.9.3-1.5 6.9-2.2 1.2 3.5 5.6 4.1 4.7 2.9 4.3-1.4 5.5-1.8 1.2 1.8 3.2 4.3 5.1 1 3.6.2 3 2.7 5.9-2.6 6-2.2 6.6-.9-4.8 1.3-4.9-2.2-3.8-.2-7-2.6-3.4-2.7-7.6-2-8.1-3.1-5.4-3.2 3.3-5.8 4.5-3.3-.5-3.6-1.5.9-8-2-6-5.3-7.4.3-2.3-3.4-.9-4.6-5.2-1.1-5.2 2.1 1-.6-4.6 2.5-1.5-1-2.7 1-2.2-.9-6.7 4.6 1.5 1.6-5.3-.3-3.1 2-5.4-.9-3.7 6.2-4.4 4.2 1.1-1.4-3.9 1.7-1.2-1-2.4 3.1-.5 2.7 3.8 2.7 1.5 1.3 4.9.9 5.3-4.2 5.4.7 7.6 5.6-1.1 2.4 5.9 3.7 1.3-.8 5.3 4.5 2.4 2.6 1.2 3.8-1.9.5 2.7zM1090.6 227.2l-.8 1.4-1.4.6-.4-1.2-1.9 3.1.5 2.1-1.1-.5-1.7-2.1-2.3-1.3.5-1 .4-3.5 1.6-1.5.9-.6 1.4 1.1.9.9 1.7.7 2.1 1.3-.4.5zM1496.2 181.5l4-1.2 5.7-.8 5.4.9 6.6 2.9 4.9 3.2h4.6l6.8 1 3.6-1.6 5.9-1 4.4-4.4 3.4.7 3.9 2.1 5.6-.6.6 4.7.3 6.3 2.8 2.5 2.3-.8 5.5 1 2.5-2.3 5.2 2 7.2 4.4.8 2.2-4.4-.7-6.8.8-2.5 1.8-1.3 4.2-6.4 2.4-3.2 3.4-5.9-1.3-3.2-.6-.5 4.1 2.9 2.4 1.9 2.1-2.4 2.2-2 3.4-4.9 2.2-7.6.2-7.2 2.2-4.4 3.4-3.3-1.9h-6.2l-9.4-3.9-5.6-.9-6.4.9-11.3-1.5-5.6.2-4.7-3.8-5-5.8-3.4-.7-8-4-7.2-.8-6.5-1.1-3-2.8-1.4-7.3-5.8-5.1-8.2-2.3-5.7-3.3-3.3-4.4 4.7-1.1 6.7-5.3 5.9-2.9 5.3 1.9 5.2.1 4.8 2.9 5 .2 8 1.6 2.4-4.4-4-3.6 1.3-6.4 7 2.5 4.8.8 6.7 1.6 3.6 4.6 8.5 2.6zM1166.7 673.5h-4.1l-.3-2.9-.6-2.9-.4-2.3 1.4-7.1-1.1-4.6-2.2-9 6.2-7.3 1.7-4.6.8-.6.9-3.8-.8-1.9.4-4.8 1.3-4.4.4-8.2-2.8-2-2.7-.5-1.1-1.6-2.6-1.3-4.7.1-.2-2.4-.4-4.6 17.2-5.3 3.2 3.1 1.5-.6 2.2 1.6.2 2.6-1.3 3 .2 4.5 3.5 4 1.9-4.5 2.5-1.3-.1-8.3-2.2-4.6-1.9-2.1h-.4l-.6-7.3 1.5-6.1 2.2-.2 6.7 1.8 1.5-.8 3.9-.2 2.1-1.9 3.4.1 6.2-2.5 4.6-3.7.9 2.8-.5 6.4.5 5.7-.2 10 .8 3.1-1.9 4.6-2.4 4.5-3.7 4-5.3 2.4-6.5 3.1-6.6 6.9-2.2 1.2-4.2 4.6-2.3 1.4-.8 4.6 2.4 4.9.9 3.7v2l1-.4-.5 6.3-1.1 3 1.2 1.1-1 2.7-2.4 2.3-4.7 2.1-6.9 3.5-2.5 2.4.3 2.7 1.3.4-.7 3.4z" />
//     <Path d="m959.2 341.5-8.5.1 2.4 27.7 2.5 27.7 1 .8-1.3 4.5-22.5.1-.9 1.4-2.1-.4-3.2 1.3-3.9-1.8-1.8.1-1 3.8-1.9 1.2-3.6-4.4-3.4-4.8-3.6-1.7-2.7-1.8h-3.1l-2.8 1.4-2.7-.5-2 2-.4-3.4 1.6-3.2.8-6-.4-6.4-.6-3.2.6-3.2-1.4-3-2.8-2.8 1.3-2.1h21.7l-.9-9.3 1.5-3.3 5.2-.5.2-16.5 18 .4.2-9.8 20.5 15.6zM1182.3 588.9h.4l1.9 2.1 2.2 4.6.1 8.3-2.5 1.3-1.9 4.5-3.5-4-.2-4.5 1.3-3-.2-2.6-2.2-1.6-1.5.6-3.2-3.1-2.9-1.6 2-6 1.8-2.2-.9-5.4 1.3-5.2 1-1.7-1.3-5.4-2.6-2.9 5.5 1.2 1 1.7-.1.8 1.8 4.1.2 7.7-1.8 3.6 1.6 4.7-.2 2.8 1.2 1.9-.1 2.4.9 1.4 1-1.6 1.9 2.5.2-.8-1-3.4-1.1-.3-.1-.9z" />
//     <Path
//       d="m1564.3 461.9 1.4.6 3.5 3.9 2.5 4.3.6 4.3-.5 2.9.6 2.2.5 3.8 2.1 1.8 2.3 5.7v2.1l-4 .5-5.5-4.8-6.8-5.1-.8-3.3-3.4-4.3-1-5.3-2.2-3.5.4-4.7-1.4-2.7.9-1.1 4.8 2.8.6 3.3 3.7-.8 1.7-2.6ZM1654.1 475.3l-5-1.1h-6.5l-1.7 7.3-2.1 2.2-2.6 8.9-4.6 1.4-5.4-1.8-2.7.6-3.3 3.2-3.6-.4-3.7 1.3-3.9-3.7-1-4.3 4.2 2.2 4.3-1.2 1-5.4 2.4-1.2 6.8-1.4 3.8-5.1 2.6-4 2.8 3.3 1.1-2.2 2.7.2.1-4.1.1-3.2 4.1-4.4 2.6-5 2.3-.1 3.1 3.3.4 2.8 3.8 1.8 4.8 1.9-.2 2.5-3.8.3 1.1 3.2-4 2.2Z"
//       className="Malaysia"
//     />
//     <Path d="m1116.2 614.3 4.6-1.4 3.6.3 2.2 1.5v.5l-3.2 1.5h-1.7l-3.7 2.5-2-2.7-8.7 2.3-4.2.2-.8 22.9-5.5.2-.6 18.7-1.1 23.7-5 3.3-2.9.5-3.4-1.2-2.5-.5-.8-2.7-2-1.8-2.8 3.2-3.9-4.9-2-4.6-1-6.3-1.2-4.6-1.6-9.9.1-7.7-.6-3.5-2.1-2.7-2.8-5.3-2.8-7.7-1.1-4-4.4-6.3-.3-4.9 2.7-1.2 3.4-1.1 3.6.2 3.3 2.9.8-.5 22.7-.2 3.8 3 13.5.9 10.4-2.6zM1068.6 355l1.6 10 2.2 1.7.1 2 2.4 2.2-1.2 2.8-1.8 13-.2 8.4-7 6-2.3 8.5 2.4 2.4v4.1l3.7.1-.6 3.1-1.5.3-.2 2.1-1 .1-3.9-7-1.4-.3-4.3 3.6-4.4-1.9-3-.3-1.6.9-3.3-.2-3.3 2.7-2.9.2-6.8-3.3-2.7 1.5-2.9-.1-2.1-2.4-5.6-2.4-6.1.8-1.4 1.3-.8 3.7-1.6 2.6-.4 5.8-4.3-3.7h-2l-1.9 1.9.1-4.4-6.5-1.5-.2-3.1-3.1-4.2-.8-2.9.5-3.1 3.6-.3 2-2.3 7.7-.5 5-1 .4-4 3.1-4.3-.1-14.8 7.8-2.8 16-12.6 18.8-12.3 8.8 2.8 3.2 3.5 3.8-2.4z" />
//     <Path d="m1066.2 421.7 2.3 2.5-.6 1.2-.3 2.1-4.7 5-1.4 4.1-.8 3.3-1.2 1.5-1.1 4.5-3 2.6-.8 3.2-1.3 2.6-.5 2.7-3.9 2.2-3.2-2.7-2.1.1-3.4 3.8h-1.6l-2.7 6.2-1.4 4.6-5.9 2.3-2.1-.3-2.2 1.4-4.5-.1-3.1-4.1-1.9-4.6-4-4.2h-9.2l.3-10.3-.2-4.1 1.1-4 1.7-2 2.8-4-.6-1.7 1.1-2.6-1.3-3.8.2-2.1.4-5.8 1.6-2.6.8-3.7 1.4-1.3 6.1-.8 5.6 2.4 2.1 2.4 2.9.1 2.7-1.5 6.8 3.3 2.9-.2 3.3-2.7 3.3.2 1.6-.9 3 .3 4.4 1.9 4.3-3.6 1.4.3 3.9 7 1-.1zM519.6 405.5l-.5.7-.5 1.4.4 2.3-1.5 2.2-.8 2.6-.5 2.8.2 1.7-.1 2.9-.9.6-.7 2.8.2 1.7-1.2 1.6.1 1.7.8 1.1-1.4 1.4-1.7-.5-.8-1.3-1.8-.5-1.3.8-3.6-1.7-.9.8-1.8-2-2.5-2.6-1.1-2.1-2.2-2.1-2.5-2.9.7-1 .8 1 .5-.4 1.8-.3.8-1.5h.8l.2-3.2 1.3-.1h1.2l1.4-1.7 1.5 1.3.6-.8 1.2-.8 2.1-1.7.2-1.4.5.1.9-1.5.6-.2.9 1 1.1.2 1.3-.8h1.4l2-.8.9-.9 1.9.1z" />
//     <Path
//       d="m1113.7 67.5-6.4 2.1-3.2.5.8-3.8-5.8-2.1-5.9 1.8-1.1 4-3.4 2.4-4.7-1.3-5.3.2-5.1-2.8-2.2 1.4-2.6.2.1 3.6-8-.9-.6 3.1h-4l-2.3 3.9-3.4 6.1-5.7 7.9 1.8 2-1.3 2.2-4.3-.1-2.4 5.4 1 7.7 3.1 2.9-.8 6.9-3.4 4-1.8 3.4-3.3-3.6-8.6 6.8-6.1 1.4-6.5-3-1.8-6.3-2-13.5 4-3.7 11.3-4.9 8.1-5.9 7.2-7.8L1048 77l6.4-4.1 10.3-6.8 8.5-2.4 6.7.3 5.2-4.4 7.4.2 7-1 13.7 3.9-4.9 1.4 5.4 3.4ZM1076.6 25.2l-7.6 1.9-6.8-1.1 2.2-1.2-2.6-1.5 7.3-.9 1.9 1.7 5.6 1.1ZM1051 16.7l12.6 3.4-8.6 1.8-1.2 3.4-3 .9-.9 4-4.4.2-8.5-2.9 3-1.7-5.7-1.4-7.7-3.9-3.2-3.5 9.3-1.6 2.3 1.5h5l1-1.5 5.2-.2 4.8 1.5ZM1075.4 13.7l7.4 1.5-4.4 2.4-10.1.5-10.7-.8-1-1.2h-5.1l-4.3-2 10.5-1.2 5.4 1 3.1-1.3 9.2 1.1Z"
//       className="Norway"
//     />
//     <Path d="m1469 322.9.2 2.7 1.5 4.1-.1 2.5-4.6.1-6.9-1.5-4.3-.6-3.8-3.2-7.7-.9-7.8-3.6-5.8-3.1-5.8-2.4.9-6 2.8-3 1.9-1.5 4.8 2 6.4 4.2 3.3.9 2.5 3.1 4.5 1.2 5 2.9 6.5 1.4 6.5.7z" />
//     <Path
//       d="m1283.8 394.9-2.2-4.5-5.2-10.6 16.3-6.4 2.6-12.8-3-4.6v-2.6l1.3-2.6-.2-2.6 2.4-1.3-1.1-.9v-4.2h2.8l3 4.4 3.3 2.3 4.1.9 3.4 1.1 2.9 3.7 1.7 2.1 2 .9.2 1.4-1.7 3.8-.7 1.8-2.2 2.1-1.7 4.4-2.5-.4-1 1.6-.7 3.2 1.1 4.3-.5.8h-2.5l-3.3 2.4-.3 3.1-1.2 1.4-3.5-.1-2 1.6.2 2.6-2.6 1.8-3.1-.6-3.6 2.2-2.5.3ZM1296.2 336.7l-1.3-2.2 1.4-2.1.7.5-.2 2.7-.6 1.1Z"
//       className="Oman"
//     />
//     <Path d="m1401.6 273.9-3.8 5.4-5.7 1-8.5-1.6-2 2.8 3.3 5.6 2.9 4.4 5.1 3.1-3.8 3.7 1 4.6-3.9 6.5-2.2 6.5-4.5 6.7-6.5-.5-4.9 6.8 4 2.8 1.4 5 3.5 3.2 1.8 5.5h-12.1l-3.2 4.3-4.2-1.6-2.2-4.6-4.9-4.9-10 1.2-9 .1-7.6.9 1.1-7.4 7.5-3.4-.9-2.9-2.7-1.1-1-5.6-5.7-2.8-2.8-3.9-3.2-3.4 9.6 3.3 5.3-1 3.4.8.9-1.4 3.9.6 6.6-2.7-.8-5.4 2.3-3.7h4.1l.2-1.7 4-.9 2.1.6 1.8-1.8-1.1-3.9 1.4-3.8 3.1-1.7-3.1-4.2 5.2.2.9-2.3-.8-2.5 2-2.7-1.4-3.2-1.9-2.7 2.4-2.8 5.3-1.3 5.9-.8 2.4-1.1 2.9-.8 4.7 3 2.9 5 9.5 2.5zM549.3 446.2l-.7.9 1.1 3.8-1.1 1.9-1.8-.5-.9 3.1-1.8-1.8-1-3.5 1.4-1.7-1.4-.4-.9-2.1-2.8-1.8-2.4.4-1.3 2.2-2.4 1.6-1.2.2-.6 1.4 2.5 3.5-1.6.8-.8.9-2.7.4-.8-3.9-.8 1.1-1.8-.4-1-2.5-2.3-.5-1.5-.7h-2.4l-.2 1.4-.6-1 .3-1.3.6-1.3-.2-1.1.9-.8-1.1-.9.1-2.6 2.2-.6 1.9 2.3-.2 1.4 2.2.3.6-.6 1.5 1.6 2.8-.5 2.5-1.6 3.5-1.3 2-1.9 3.1.4-.2.6 3.1.2 2.4 1.2 1.8 1.9 2 1.8zM590.5 529.4l-5.1-.3-.8 1-4.6 1.2-6.3 4.4-.3 3-1.4 2.2.7 3.5-3.4 1.8.2 2.8-1.5 1.1 2.6 5.8 3.3 3.9-1 2.8 3.8.3 2.3 3.5 5 .1 4.4-3.7.1 9.7 2.6.7 3.2-1.1 5.5 10.4-1.1 2.1v4.6l.3 5.4-1.9 3.2 1.2 2.4-1.1 2.2 2.9 5.4-2.9 6.9-1.1 3.3-2.8 1.6-5.9-3.7-.8-2.6-11.7-6.4-10.7-7.1-4.7-3.9-2.8-5.3.8-1.9-5.4-8.4-6.4-11.8-6-12.8-2.4-3-2-4.7-4.6-4.2-4.1-2.6 1.7-2.8-3-6.2 1.7-4.5 4.4-4 .7 2.7-1.6 1.5.3 2.3 2.3-.5 2.3.7 2.5 3.3 3.1-2.7.9-4.3 3.4-5.6 6.7-2.5 6.1-6.8 1.7-4.1-.8-4.9 1.5-.6 3.8 3 1.8 3.1 2.6 1.6 3.5 6.7 4.2.9 3.1-1.7 2.1 1.1 3.4-.6 4.4 3-3.5 6.6 1.7.1 2.9 3.4z" />
//     <Path
//       d="m1700.5 447.8.9 4.3.6 3.6-1.6 5.8-2.5-6.5-2.4 3.3 2.1 4.7-1.4 3-6.9-3.7-1.9-4.7 1.5-3-3.8-3.1-1.6 2.7-2.6-.3-4 3.6-1-1.9 1.8-5.4 3.4-1.8 2.9-2.4 2.2 2.9 4.2-1.7.7-2.9 4-.2-.8-4.9 4.9 3 .7 3.2.6 2.4ZM1685.9 435.8l-1.8 2.1-1.4 4.1-1.6 1.9-3.9-4.4 1-1.8 1.3-1.8.2-3.9 3.1-.4-.5 4.3 3.6-6.2v6.1ZM1655.6 442l-7.1 6.1 2.4-4.5 3.8-4 3-4.4 2.3-6.4 1.6 5.3-3.5 3.5-2.5 4.4ZM1673.1 425.5l3.6 2h3.5l.2 2.6-2.3 2.8-3.4 1.9-.5-3 .1-3.3-1.2-3ZM1693.2 423.7l2.4 7.2-4.5-1.7.3 2.2 1.8 3.9-2.6 1.5-.6-4.6-1.8-.3-1.2-3.9 3.3.5-.3-2.4-4-4.9 5.4.1 1.8 2.4ZM1670.2 417.9l-.9 5.6-2.7-3.2-3.5-4.9 4.8.2 2.3 2.3ZM1663.7 383l3.8 1.9 1.4-1.7.8 1.6-.4 2.7 2.6 4.6-.6 5.3-2.9 2.1-.1 5.2 2 5.1 3 .7 2.4-.7 7.5 3.5-.1 3.5 2.1 1.6-.3 2.9-4.7-3.1-2.5-3.4-1.2 2.4-4-3.9-5 1-3-1.4-.1-2.7 1.6-1.6-1.9-1.5-.4 2.3-3.3-3.7-1.3-2.8-1.1-6.1 2.6 2.1-1.1-10.1.8-5.8h3.4Z"
//       className="Philippines"
//     />
//     <Path
//       d="m1868.1 545.6-1.6.7-2.3-2.5-2.2-4.1-.8-4.9.8-.6.5 1.9 1.6 1.5 2.4 4 2.5 2.2-.9 1.8ZM1846.7 537l-3 .5-1 1.8-3.2 1.6-3 1.5h-3.1l-4.5-1.9-3.1-1.8.6-2 5 1 3.2-.5 1-3.1.9-.2.3 3.4 3.2-.4 1.8-2.2 3.3-2.3-.4-3.8 3.4-.1 1.1 1-.4 3.6-2.1 3.9ZM1782.9 560.4l1.6-21 1-20.9 9.6 4.4 10.3 3.7 3.7 3.3 3 3.2.6 3.8 9.2 4 1.1 3.4-5.2.7.9 4.3 4.7 4.2 3 6.8 3.3-.2-.6 2.8 4.3 1.1-1.8 1.2 5.7 2.7-.9 1.9-3.8.4-1.2-1.6-4.7-.8-5.6-.9-4-4.1-2.8-3.6-2.5-5.6-7.1-2.8-4.9 1.8-3.7 2.2.3 4.7-4.6 2.2-3.1-1.1-5.8-.2ZM1853.6 530.7l-1.8 1.7-.9-3.8-1.1-2.4-2.5-2.1-3.1-2.8-4-1.9 1.6-1.5 3 1.8 1.9 1.4 2.3 1.5 2.1 2.7 2.1 2.1.4 3.3Z"
//       className="Papua New Guinea"
//     />
//     <Path d="m1079.9 154.8 5.9.7 8.8-.1 2.5.7 1.4 1.9.6 2.7 1.7 2.3.4 2.4-2.8 1.3 1.9 2.8.5 2.8 3.2 5.4-.3 1.7-2.3.7-3.8 5.2 1.6 2.8-1.1-.4-5-2.4-3.5.9-2.4-.6-2.8 1.3-2.7-2.2-1.9.9-.3-.4-2.6-3.1-3.7-.3-.7-2-3.4-.7-.6 1.6-2.8-1.3.2-1.7-3.7-.5-2.5-2-2.4-3.9.2-2.2-1.5-3.3-1.9-2.1 1.2-1.7-1.4-3.1 3.1-1.8 7.1-2.8 5.8-2 4.8 1 .6 1.5h4.6zM1660.3 229.9l1.4 1.1-2.2-.4-1 2.2-.3 2.1 2.8 4.6-1.9 1.4-.3 1.1-.9 1.9-2.9 1.1-1.4 1.7 1.3 2.7-.3.7 2.6 1.1 4.4 2.8v1.5l-2 .4-3.6.4-.6 2.8-2.5-.2v.6l-3.2-1.2-.1 1.2-1.3.5-.7-1.2-1.7-.6-1.9-1 .1-2.8.9-.8-1-1.1-.4-3.5-.9-1-3.4-.7-3.4-1.7 2.1-4.1 3.9-3.4 1.1-4.6 3.6 2 4.6.3-2.8-3.4 6.4-2.7v-3.6l5.5 3.8zM662.5 631.4l2 3.5.4 8.7 5.9 1.3 2.2-1.3 3.9 1.8 1.2 1.9 1.1 5.9.8 2.4 2.1.3 2-1 2.1 1.1.3 3.6-.3 3.8-.7 3.7-.3 5.6-4.3 5-4.2 1-6.3-1-5.8-1.7 4.2-9.8-1.1-2.8-5.9-2.5-7.3-4.8-4.6-1-11.3-10.4 1.5-7.7-.2-3.5 2.1-5.6 9.6-1.9 5.2.1 5.4 3.3.3 2zM1178.3 293.8l.4 4-.6 1.9-2.5.8.1-1.7 1.3-.9-1.5-.7.7-4.2 2.1.8zM1270.1 343.7l-1.5.5-1.8-1.3-.8-4.7 1.1-3.3 1.5-.7 1.8 2 .5 3.7-.8 3.8zM1118.9 193.1l1.6.7 1.8 1.8 2 2.6 3.4 3.8.6 2.7-.2 2.7 1.3 2.9 2.4 1.2 2.3-1.1 2.4 1.1.4 1.7-2.3 1.3-1.6-.6-.4 7.7-3.1-.7-4-2.3-5.9 1.5-2.3 1.6-7.6-.4-4-.9-1.9.4-1.8-2.6-1-1.1 1-1.1-1.3-.7-1.5 1.4-3.1-1.9-.7-2.6-3.2-1.4-.8-2.1-3-2.4 3.9-1.2 2.6-4.3 1.9-4.2 2.9-1.3 2-1.4 3.2.7h3.2l2.5 1.6 1.6-1 3.6-.6 1-1.5h2.1zM1158.8 509.1l2.2 3.6-.3 3.8-1.6.8-3.1-.4-1.7 3.7-3.5-.5.6-3.6.8-.5.2-3.8 1.6-1.8 1.4.7 3.4-2zM938.9 324.3l-.1.4-.1 1.2-.2 9.8-18-.4-.2 16.5-5.2.5-1.5 3.3.9 9.3h-21.7l-1.3 2.1.3-2.7h.1l12.5-.5.7-2.3 2.4-2.9 2-8.9 7.9-6.9 2.7-8.1 1.8-.5 1.9-5 4.6-.7 2 .9h2.5l1.8-1.5 3.4-.2-.1-3.4h.9z" />
//     <Path d="m1240.5 315 5 .6 1.7 3.1 3.9-.2 2.7 5.6 2.9 1.4 1.2 2.3 4 2.7.7 2.6-.4 2.2.9 2.1 1.8 1.8.9 2.1 1 1.6 1.8 1.3 1.5-.5 1.3 2.5.3 1.4 2.7 6.6 16.9 3.2 1-1.4 3 4.6-2.6 12.8-16.3 6.4-15.9 2.5-5 2.9-3.5 6.7-2.6 1.1-1.5-2.1-2.1.3-5.5-.7-1.1-.6-6.4.1-1.5.6-2.4-1.6-1.3 3.1.8 2.7-2.4 2.1-.9-2.8-1.8-1.9-.5-2.6-3.1-2.3-3.3-5.4-1.9-5.2-4.1-4.4-2.5-1.1-4.1-6.1-.9-4.4v-3.8l-3.6-7.2-2.8-2.5-3-1.3-2.1-3.7.2-1.4-1.8-3.4-1.7-1.4-2.5-4.8-3.8-5.1-3.1-4.4h-2.7l.5-3.5.1-2.3.4-2.6 6.2 1.1 2.1-2 1.1-2.3 4.1-.9.7-2.2 1.6-1-6-6.5 10.4-3.2.9-1 6.8 1.8 8.6 4.5 16.8 12.9 10.2.5zM1191 409.2l-.7 5.5-2 6.4-3.3 3.1-2.3 5-.5 2.6-2.6 1.8-1.5 6.7v.8l-.8-.2.1-3.2-.8-2.2-2.9-2.5-.9-4.6.6-4.8-2.6-.4-.4 1.4-3.4.4 1.5 1.8.5 3.9-3 3.5-2.7 4.6-2.9.7-4.8-3.7-2.1 1.3-.5 1.8-2.9 1.3-.2 1.3h-5.6l-.8-1.3-4.1-.3-2 1.1-1.6-.5-2.9-3.8-1-1.7-4.1.9-1.5 2.9-1.3 5.8-2 1.2-1.7.7-.5-.3-1.9-1.9-.4-2 .8-2.6V437l-3.3-4-.7-2.7v-1.6l-2.1-1.9-.1-3.7-1.3-2.5-1.9.4.5-2.4 1.4-2.6-.7-2.7 1.8-2-1.2-1.5 1.3-3.9 2.5-4.8 4.8.5-1.1-25.5v-2.7h6.4l-.5-12.8h65.9l2.1 6.3-1.2 1.1 1.2 6.7 2.5 7.6 2.2 1.6 3.2 2.4-2.7 3.6-4 1.1-1.7 2-.3 4.2-2 9.5.7 2.5z" />
//     <Path d="m1178.1 441.1.2 5-.8 1.9-3 .2-1.9 3.6 3.5.5 3 3.1 1 2.6 2.6 1.5 3.5 7-3.8 4.2-3.4 3.8-3.5 3h-4l-4.5 1.5-3.6-1.5-2.3 1.8-5.1-4.3-1.4-2.7-3.1 1.3-2.6-.4-1.5 1.1-2.6-.8-3.5-5.3-.9-2-4.3-2.6-1.4-3.8-2.4-2.8-3.9-3.3-.1-2.1-3.1-2.6-3.9-2.5 1.7-.7 2-1.2 1.3-5.8 1.5-2.9 4.1-.9 1 1.7 2.9 3.8 1.6.5 2-1.1 4.1.3.8 1.3h5.6l.2-1.3 2.9-1.3.5-1.8 2.1-1.3 4.8 3.7 2.9-.7 2.7-4.6 3-3.5-.5-3.9-1.5-1.8 3.4-.4.4-1.4 2.6.4-.6 4.8.9 4.6 2.9 2.5.8 2.2-.1 3.2.8.2zM918 408l.2 4 1.1 3.7 2 1.8.5 2.4-.3 2-.8.4-3.1-.5-.4.7-1.2.1-4.1-1.5-2.7-.1-10.4-.3-1.5.8-1.9-.2-3 1-.8-4.9 5.1.1 1.4-.9h1l2.1-1.5 2.4 1.3 2.4.2 2.5-1.5-1.1-1.8-1.9 1h-1.7l-2.2-1.6-1.8.1-1.3 1.6-6.1.1-2.3-5-2.7-2.2 2.5-1.3 2.8-4.5 1.4-3.3 2-2 2.7.5 2.8-1.4h3.1l2.7 1.8 3.6 1.7 3.4 4.8 3.6 4.4zM928.5 447.9l-2.6 3-2.6 3.4-.3 1.9-1.4 2.1-1.5-.5-4-2.6-3-3.4-.9-2.4-.7-4.7 3.1-2.9.6-1.7 1-1.4 1.6-.2 1.3-1.2h4.5l1.6 2.3 1.2 2.7-.2 1.9.9 1.7-.1 2.3 1.5-.3zM492.5 415.9l-.7 1.5-3.3-.1-2-.6-2.2-1.3-3-.4-1.5-1.4.3-.9 2-1.6 1.2-.7-.3-.8 1.4-.4 1.6.6 1.1 1.2 1.6 1.1.1.8 2.5-.7 1.2.4.7.7-.7 2.6zM1102 218.2l-1.1 1.4.7 2.4 2.8 2.7-1.8 2-.6 2 .6.8-.7.8-2.4.2-1.7.3-.3-.5.6-.7.4-1.6-.7.1-1.1-1.2-.9-.3-.8-1-1-.4-.8-.9-.9.4-.5 2.1-1.2.4.4-.5-2.1-1.3-1.7-.7-.9-.9-1.4-1.1 1.1-.3.5-2.9-2.7-2.5 1.1-2.8-1.9.1 1.7-2.4-1.7-1.8-1.5-2.5 3.7-1.6 3.2.3 3 2.4.8 2.1 3.2 1.4.7 2.6 3.1 1.9 1.5-1.4 1.3.7-1 1.1 1 1.1zM681 464.9l-3.1 5.5.3 4.4 2.2 3.8-1.1 2.7-.5 3-1.5 2.7-3.2-1.4-2.7.7-2.3-.6-.6 1.9 1 1.2-.6 1.4-3.1-.6-3.3-5.6-.7-3.6H660l-2.4-4.6 1.1-3.4-.3-1.5 3.5-1.6 1-5.8 6.8 1.3.6-1.2 4.6-.5 6.1 1.8zM1098.1 187.7l-1.2 1.7-.7 2.5-1 .6-5.5-1.9-1.6.4-1 1.5-2.3.8-.6-.4-2.3.9-1.9.2-.3 1.3-4.1.7-1.9-.6-2.7-1.7-.7-2.1.3-.8.6-1.4 2.2.1 1.6-.6.1-.6.9-.3.2-1.4 1.1-.3.7-1.1h1.5l.3.4 1.9-.9 2.7 2.2 2.8-1.3 2.4.6 3.5-.9 5 2.4zM1069.8 203.9l-3.9 1.7-.3 2.5-1.7.7.1 1.7-2-.1-1.8-1-.8 1-3.6-.2 1.1-.5-1.4-2.7.4-3.1 4.2.5 2.4-1.5 4.4-.1.9-1.1.8.1 1.2 2.1zM1088.2 87l-7 1.6-3.5 3.9 1.3 3.5-6.2 4.5-7.8 5-2.1 8.1 3.7 4.1 4.8 3.3-3.3 6.6-4.6 1.4-.6 10-2.1 5.7-5.7-.6-2.2 4.8-5.5.3-1.9-5.7-4.5-6.9-4.2-8.4 1.8-3.4 3.4-4 .8-6.9-3.1-2.9-1-7.7 2.4-5.4 4.3.1 1.3-2.2-1.8-2 5.7-7.9 3.4-6.1 2.3-3.9h4l.6-3.1 8 .9-.1-3.6 2.6-.2 6 2.7 7.2 3.7 1.8 8.5 1.8 2.2zM1161.7 667.7l.6 2.9.3 2.9-1.4 2.8-3.2.7-3.1-3.5.1-2.2 1.7-2.4.6-1.9 1.7-.4 2.7 1.1zM1195 287.5l-9.7 6.9-6.3-2.6h-.1l.6-1-.4-2.6.9-3.5 2.7-2.5-1.2-2.5-2.5-.3-1.1-4.9 1-2.7 1.3-1.4 1.2-1.4-.2-3.5 1.9 1.2 5.6-1.8 3 1.2h4.4l5.7-2.4 2.9.1 5.9-1-2.1 4-2.7 1.6 1.2 4.7-1 7.7-11 6.7zM1119.2 376.1l1.1 25.5-4.8-.5-2.5 4.8-1.3 3.9 1.2 1.5-1.8 2 .7 2.7-1.4 2.6-.5 2.4 1.9-.4 1.3 2.5.1 3.7 2.1 1.9v1.6l-3.6 1.1-2.8 2.6-4 7-5.2 3-5.5-.4-1.6.6.6 2.2-2.9 2.3-2.4 2.5-7.1 2.4-1.4-1.4-1-.2-1 1.7-4.6.5.8-1.8-1.8-4.4-.8-2.6-2.5-1.1-3.4-3.8 1.2-3 2.6.6 1.6-.4h3.2l-3.2-5.8.2-4.3-.5-4.2-2.3-4.1.6-3.1-3.7-.1V412l-2.4-2.4 2.3-8.5 7-6 .2-8.4 1.8-13 1.2-2.8-2.4-2.2-.1-2-2.2-1.7-1.6-10 5.5-3.5 22.5 12.3 22.6 12.3zM991.4 431.2l-.7 3.4 1.7 1.9 2 2.2.2 3.2 1.2 1.3-.3 14.8 1.4 4.4-4.5 1.4-1.3-2.3-1.5-4.1-.5-3.2 1.3-5.7-1.4-2.4-.6-5v-4.7l-2.3-3.3.4-2 4.9.1zM1577.5 410.2l-5.3-.9-7.1 1.2-3.1 5.3 2.1 7.8-5.3-3-4.8.2.3-5.1h-4.9l.2 7.1-2.2 9.4-1.4 5.7.7 4.6 3.7.2 2.7 5.9 1.3 5.5 3.4 3.7 3.4.7 3.1 3.4-1.7 2.6-3.7.8-.6-3.3-4.8-2.8-.9 1.1-2.3-2.4-1.2-3.2-3.2-3.6-2.9-3.1-.7 3.8-1.3-3.6.4-4 1.2-6.1 2.2-6.6 2.6-6-2.7-5.9-.2-3-1-3.6-4.3-5.1-1.8-3.2 1.8-1.2 1.4-5.5-2.9-4.3-4.1-4.7-3.5-5.6 2.2-1.2 1.5-6.9 3.9-.3 2.8-2.8 3-1.5 2.7 2 .9 3.9 3.8.3-.4 6.7 1 5.8 5.3-3.8 1.9 1.1 3.2-.2.8-2.2 4.3.4 5 5.2 1.3 6.4 5.3 5.6.4 5.4-1.5 2.9zM1357 243.6l-1.4 1.9-6-1 .6 3.6 5.5-.5 7.1 2.1 9.6-1 3.1 6 1.5-.7 3.7 1.5.5 2.5 1.8 3.6h-5.4l-3.8-.5-2.5 2.9-2.2.6-1.5 1.4-2.7-2.1-.9-5.4-1.7-.3.1-2-3.3-1.4-1.7 2.2.2 2.6-.6.9-3.2-.1-.9 2.9-2.1-1.2-3.4 2-1.8-.7 1.3-6.5-2.4-4.8-4.2-1.5.6-2.8 4.4.3 1.5-3.5.5-4.1 6.5-1.5-.2 3 1.3 1.7 2.1-.1zM1338.3 262l-1.6-.2-2.9-1.7-.3 2.2-4.2 1.3.2 5.1-2.6 2-4 .9-.4 2.9-3.9.9-5.9-2.5-1.7-5.3-4-.3-7.3-5.6-4.3-.7-6.6-3.3-3.9-.6-2 1.2-3.6-.2-3 3.7-4.4 1.2-1.9-4.5-.6-6.7-4.6-2.2.4-4.3-3.5-.4-.1-5.4 5.3 1.6 4.1-2-4.7-3.9-2.4-3.6-3.8 1.6.6 4.7-2.6-4.1 1.8-2.2 5.6-1.3 3.9 1.8 4.8 5 2.6-.3 5.9-.1-1.7-3.2 3.8-2.2 3.4-3.7 7.9 3.4 1.9 5 2.3 1.3 5.5-.3 2.1 1.2 4.3 6.6 7.1 4.4 4.2 3 6.3 3.1 7.7 2.8.8 3.9zM1692.7 562.1l.1-1.9-.5-1.3.8-1.5 4.9-1.4 4-.3 1.8-.8 2.1.8-2.2 1.8-6.1 2.8-4.9 1.8zM1048.2 289.1l-.1 4.9-2.6 1.8-1.6 2.1-3.6 2.5.6 2.6-.4 2.8-2.6 1.4-2.6-11.5-3.4-2.6-.1-1.5-4.5-3.9-.6-4.8 3.2-3.6 1.1-5.3-1-6.1 1-3.3 5.7-2.5 3.7.7v3.3l4.4-2.4.4 1.2-2.5 3.2.1 2.9 1.9 1.6-.5 5.6-3.5 3.2 1.2 3.5 2.8.1 1.4 3.1 2.1 1z" />
//     <Path
//       d="m1201.7 235.3 5.5-.3 5.6 3.2 1.3 2.2.1 3.1 4.2 1.6 2.4 1.8-3.3 1.9 2.9 7.3-.7 2 3.8 5.1-2.4 1.1-2.1-1.6-6.3-.9-2.1 1-5.9 1-2.9-.1-5.7 2.4h-4.4l-3-1.2-5.6 1.8-1.9-1.2.2 3.5-1.2 1.4-1.3 1.4-2.3-2.9 1.7-2.4-3.2.6-4.6-1.5-3.2 3.7-8 .7-4.7-3.4-5.7-.2-1 2.6-3.6.8-5.4-3.4-5.8.1-3.8-6.4-4.2-3.5 2-5-3.6-3.1 5.1-6.1 8-.2 1.6-4.9 10 .9 5.6-4.1 5.8-1.8 8.5-.2 9.8 4.5 7.9 2.5 5.8-1 4.6.6 5.5-3.4ZM1121.9 239.9l1.2-.7 1.1-4-2.7-1.7 5-2 4.6.8.9 2.5 4.8 2-.7 1.6-6.2.3-2 2-3.9 3.4-2-2.9-.1-1.3Z"
//       className="Turkey"
//     />
//     <Path d="m1657.9 355.5-1.4 5.3-4-5.5-1.5-4.7 1.9-6.3 3.3-4.9 3 1.9-.1 3.9-1.2 10.3zM1167 508.4l-.2 3.9-1.1 4.5 1.6 2.5 2.5-1.5 3.3-.4.7.8 3.3-1.6-2.3-2.2 1.9-2.9 2.8-2.9 20.5 13.1.3 3.7 8.1 6.4-2.8 8 .3 3.6 3.5 2.3.2 1.7-1.7 3.9.3 1.9-.4 3.1 1.8 4 2.2 6.4 2 1.4-4.6 3.7-6.2 2.5-3.4-.1-2.1 1.9-3.9.2-1.5.8-6.7-1.8-2.2.2.1-.1-1.8-2.4-.3-6.8-2.9-3.4-.4 1.2-1-1.7-5.5-1.2-3.2-1.9-3.6-1.1-2.2-1.1-.3-.2-2.7-6.6-.4-3.9-4.5-4.4 1.4-2.4-1.1-2.6.2-2.7-1-.9.3-2.8.6-.1 2-2.3 2.3-3.4 1.4-1.3v-2.1l-1.2-1.5-.3-2.5 1.6-.8.3-3.8-2.2-3.6 2-.8 6.2.1z" />
//     <Path d="m1179 474.5 2.7 4.5.7 3.2 2.6 7.4-2.1 4.7-2.8 4.2-1.6 2.6v.3l-.2-.4-3-1.3-2.4 1.6-3.6.9-2.6 3.7.3 2.5-6.2-.1-2 .8-3.4 2-1.4-.7.1-4.8 1.3-2.5.3-5.1 1.2-3 2.2-3.3 2.1-1.8 1.9-2.2-2.3-.9.3-7.5 2.3-1.8 3.6 1.5 4.5-1.5h4l3.5-3zM1157.2 174.6l2.3 2.7.1 1.2 6.7 2.2 3.6-1 3.6 2.9 2.9-.1 7.7 2 .4 1.9-1.3 3.2 1.8 3.5-.3 2.1-4.8.4-2.2 1.8.4 2.7-3.9.5-3 2.1-4.6.3-4 2.4 1 3.9 2.8 1.5 5.1-.4-.6 2.3-5.4 1.1-6.3 3.6-3.1-1.3.7-2.9-5.9-1.9.7-1.2 4.6-2.1-1.7-1.4-8.1-1.6-.8-2.4-4.5.8-1.3 3.5-3.3 4.6-2.4-1.1-2.3 1.1-2.4-1.2 1.2-.7.6-2.1 1.1-2.1-.6-1.1 1-.5.6.9 3 .2 1.3-.5-1-.6.2-1-2-1.6-1.1-2.6-2-1 .1-2.1-2.6-1.7-2-.3-4-1.9-3.2.6-1.1.9h-2.1l-1 1.5-3.6.6-1.6 1-2.5-1.6h-3.2l-3.2-.7-2 1.4-.5-1.7-3-1.7.7-2.5 1.2-1.7 1.1.4-1.6-2.8 3.8-5.2 2.3-.7.3-1.7-3.2-5.4 2.3-.3 2.4-1.6 3.8-.2 4.9.5 5.7 1.5 3.9.1 1.9.9 1.7-1.1 1.5 1.5 4.3-.3 2.1.6-.3-3.1 1.3-1.4 4.1-.3 1.8.2 1-1.4 1.5.3 4.9-.6 3.8 3.5-.9 1.3.8 1.9 3.9.3zM699.7 718.6l-1.6 4.1-5.4 3.5-4.2-1.3-2.8.7-5.5-2.7-3.6.2-3.9-3.6-.4-4.1.9-1.4-1.2-6.4.4-6.6.5-5.2 3.4-.7 6.3 5 1.9-.2 6.3 4.1 4.8 3.6 3.8 4.3-1.8 3.1 2.1 3.6zM1352.7 230.7l1.7.6-3 4.1 4.6 2.4 3.2-1.6 7.2 3.4-5.3 4.6-4.1-.6-2.1.1-1.3-1.7.2-3-6.5 1.5-.5 4.1-1.5 3.5-4.4-.3-.6 2.8 4.2 1.5 2.4 4.8-1.3 6.5-4.3-1.4h-3l-.8-3.9-7.7-2.8-6.3-3.1-4.2-3-7.1-4.4-4.3-6.6-2.1-1.2-5.5.3-2.3-1.3-1.9-5-7.9-3.4-3.4 3.7-3.8 2.2 1.7 3.2-5.9.1-6.2-23.4 12-3.7 1.1.5 9.2 4.5 4.8 2.4 6.6 5.7 5.7-.9 8.6-.5 7.6 4.6 1.5 6.4 2.6.1 2.5 5.2 6.7.2 2.3 3h2l.9-4.6 5.4-4.4 2.6-1.2zM648.7 448.1l-4.7 3.8-.5 2.3 1.8 2.4-1.4 1.2-3.5 1v3l-1.6 1.8 3.7 4.8.7 1.8-2.1 2.5-6.4 2.4-4.1 1-1.7 1.5-4.5-1.6-4.1-.8-1.1.6 2.5 1.6-.3 4.3.7 4.1 4.8.5.3 1.4-4.1 1.8-.7 2.7-2.4 1.1-4.2 1.5-1.1 2-4.4.4-3.1-3.4-1.6-6.4-1.5-2.3-2-1.4 2.9-3.2-.2-1.4-1.5-1.9-1.1-4.3.6-4.6 1.3-2.2 1.2-3.4-2-1.1-3.2.7-4.1-.3-2.3.7-3.8-5.6-3.3-.8-7.3.6-1.2-2.2-1.4-.5-.1-1.4.7-2.4-.3-2.5-1.2-1.5-.6-2.9-2.9-.4 1.8-3.8.9-4.6 1.8-2.4 2.3-1.8 1.6-3.2 3.7-1.1-.2 1.5-3.4.8 1.7 2.9-.3 3.4-2.7 3.7 1.9 5.1 2.5-.4 1.5-4.7-1.7-2.2v-4.9l7.2-2.6-.6-3 2.1-2.1 1.7 4.6 4 .1 3.4 3.5.2 2.2h5l6.1-.6 3.1 2.8 4.2.8 3.3-2 .1-1.6 7.1-.4 6.7-.1-4.9 1.9 1.8 3.1 4.5.4 4.2 3.2.7 5.1 2.9-.1 2.2 1.5zM1586.5 363.5l-6.5 5.4-3.7 6.1-.6 4.5 5.3 6.7 6.5 8.4 5.7 4 4.1 5.1 4 11.9.4 11.3-4.3 4.2-6.1 4.2-4.2 5.3-6.6 6-2.3-4.1 1.2-4.4-4.4-3.6 4.6-2.6 5.9-.5-2.8-3.8 9-5-.1-7.7-1.8-4.3.2-6.4-2-4.5-4.9-4.5-4.4-5.6-5.7-7.6-7.3-3.9 1.2-2.3 3.3-1.7-3-5.6h-6.8l-3.5-5.8-4-5.1 2.7-1.6 4.4.1 5.3-.8 4.1-3.4 3.1 2.4 5.3 1.2-.3 3.7 3.1 2.6 5.9 1.7zM1283.8 394.9l-4 1.7-.9 2.9v2.2l-5.4 2.7-8.8 3-4.7 4.5-2.5.4-1.7-.4-3.2 2.7-3.5 1.2-4.7.3-1.4.4-1.1 1.7-1.5.5-.8 1.6-2.8-.2-1.7.9-4-.3-1.6-3.8v-3.5l-1-1.9-1.3-4.7-1.8-2.6 1.1-.4-.7-2.9.6-1.2-.4-2.8 2.4-2.1-.8-2.7 1.3-3.1 2.4 1.6 1.5-.6 6.4-.1 1.1.6 5.5.7 2.1-.3 1.5 2.1 2.6-1.1 3.5-6.7 5-2.9 15.9-2.5 5.2 10.6 2.2 4.5zM1162.1 556.8l.3.2 2.2 1.1 3.6 1.1 3.2 1.9 2.6 2.9 1.3 5.4-1 1.7-1.3 5.2.9 5.4-1.8 2.2-2 6 2.9 1.6-17.2 5.3.4 4.6-4.3.9-3.3 2.5-.8 2.2-2 .6-5.1 5.2-3.2 4.2-1.9.1-1.8-.7-6.2-.7-1-.5v-.5l-2.2-1.5-3.6-.3-4.6 1.4-3.6-4-3.6-5.2.8-20.5 11.7.1-.4-2.2.9-2.4-.9-3 .7-3.1-.6-2 1.9.1.3 2 2.7-.1 3.5.6 1.9 2.9 4.4.9 3.5-2 1.2 3.3 4.3.9 2 2.8 2.2 3.5h4.3l-.2-6.9-1.6 1.2-3.9-2.5-1.5-1.2.9-6.4 1.1-7.6-1.2-2.8 1.7-4.1 1.5-.8 7.7-1.1.9.3-.3 1.4 1.9.5 1.2 1.3 1-.3-.5-1.1z" />
//     <Path d="m1159.4 644.7-2.9-.7-1.9.8-2.7-1.1h-2.2l-3.4-2.9-4.3-1-1.5-4.1.1-2.3-2.3-.7-6.1-7-1.6-3.7-1.1-1.2-1.9-5.1 6.2.7 1.8.7 1.9-.1 3.2-4.2 5.1-5.2 2-.6.8-2.2 3.3-2.5 4.3-.9.2 2.4 4.7-.1 2.6 1.3 1.1 1.6 2.7.5 2.8 2-.4 8.2-1.3 4.4-.4 4.8.8 1.9-.9 3.8-.8.6-1.7 4.6-6.2 7.3zM1222.1 512.6l-3.3-5.3-.2-23.4 4.9-7.2 1.5-2.1 3.6-.1 5-4.5 7.3-.3 15.6-19.3-4.8.1-18.7-7.6-2.2-2.3-2.2-3.1-2.2-3.6 1.2-2.2 1.9-3.5 1.9 1.2 1.2 2.7 2.7 2.7h2.8l5.2-1.7 6.1-.7 4.9-2 2.8-.4 2-1.2 3.2-.2 1.8-.2 2.5-.9 3-.7 2.5-2.2h2.2l.2 1.8-.4 3.7.2 3.4-1.1 2.3-1.4 7-2.4 7.1-3.3 8.2-4.6 9.4-4.7 7.2-6.6 8.8-5.6 5.2-8.4 6.4-5.3 4.8-6.2 7.8-1.3 3.4-1.3 1.5zM1097.8 230.8l-1.2.3-2.9 1-.1 1.3-.7-.1-.6-2.3-1.3-.7-1.2-1.7.8-1.4 1.2-.4.5-2.1.9-.4.8.9 1 .4.8 1 .9.3 1.1 1.2.7-.1-.4 1.6-.6.7.3.5z" />
//     <Path d="m1159.4 644.7 2.2 9 1.1 4.6-1.4 7.1.4 2.3-2.7-1.1-1.7.4-.6 1.9-1.7 2.4-.1 2.2 3.1 3.5 3.2-.7 1.4-2.8h4.1l-1.7 4.7-1 5.3-1.7 2.9-4 3.3-1.1.9-2.6 3.3-1.8 3.3-3.5 4.6-6.7 6.6-4.1 3.8-4.3 3-5.9 2.4-2.7.4-.9 1.8-3.2-1-2.7 1.2-5.7-1.2-3.3.8-2.2-.4-5.8 2.6-4.6 1-3.5 2.4-2.4.2-2.1-2.3-1.8-.1-2.2-2.9-.3.9-.6-1.7.3-3.8-1.5-4.3 1.8-1.2.1-4.9-3.3-6-2.4-5.4v-.1l-3.6-8.3 2.8-3.2 2 1.8.8 2.7 2.5.5 3.4 1.2 2.9-.5 5-3.3 1.1-23.7 1.4 1 3 6.1-.6 3.9 1.1 2.3 4-.7 2.8-2.9 2.7-1.9 1.5-3.1 2.8-1.4 2.3.7 2.5 1.8 4.5.3 3.6-1.4.6-2 1.2-3.1 3-.5 1.8-2.4 2-4.3 5.2-4.8 8.1-4.7h2.2l2.7 1.1 1.9-.8 2.9.7zm-20.3 53.2 1.1-2 3.1-1 1.1-2.1 1.9-3.1-1.7-2-2.2-2-2.7 1.4-3.1 2.5-3.2 4 3.7 5 2-.7z" />
//     <Path
//       d="m1886.2 764.4-.8 2.6 5.6-2.6-.5 2.7-2.1 2.7-4.2 2.9-7.1 4.7-4.7 2.6-.6 3-4 .1-6.3 2.4-4.7 4.1-8.2 6.4-6.3 2.8-4 1.8-4.6-.1-1.5-2.1-5.1-.4 1-2.4 6.5-4.6 11.4-6.3 4.3-1.2 5.6-2.4 7-3.3 5.7-3.3 6-4.7 3.1-1.6 3.5-3.6 5.8-2.9-.8 2.7ZM1915.2 733.9l-.4 6.8 2.9-4.4 1.3 1.8-2.4 4.8 2.9 2.1 3.2.5 4.7-2.4 2.2.7-5.2 5.7-4.2 3.7-3.9-.1-2.8 1.9-1.5 2.8-1.6 1.1-4.6 3.5-5.9 4.3-6 2.6.5-1.7-1.5-.9 6.9-5.2.9-3.6-3.8-2.5 1.8-2.3 5.3-2.2 4.2-5 2.5-4.1.6-4.3.8-1.1-.9-2.7-.7-5.6.4-4.6 2.2-.5.9 3.6 3.2 1.6-2 5.7Z"
//       className="New Zealand"
//     />
//     <Path
//       d="m655.1 837.9 6 13.6h5l3 .2-.5 2.4-3.2 1.9-2.4-.2-3.1-.5-4.2-1.8-5.4-.9-7.5-3.4-6.4-3.2-9.8-6.9 4.6 1.3 8.6 4.1 7.3 2.2 1.2-2.8-.3-4.2 3.4-2.6 3.7.8Z"
//       className="Chile"
//     />
//     <Path
//       d="m614.4 647.8.9 1.6-1.2 6.7-5.6 3.1 1.6 10.7-.8 2.1 2 2.5-3.3 4-2.6 6-.9 5.9 1.7 6.2-2.1 6.6 4.9 11.1 1.6 1.2 1.4 5.9-1.6 6.2 1.4 5.4-3 4.2 1.6 5.8 3.3 6.3-2.5 2.3.2 5.7.8 6.5 3.3 7.8-1.7 1.3 3.7 7.3 3.1 2.4-.8 2.7 2.8 1.2 1.4 2.4-1.8 1.2 1.8 3.7 1.1 8.3-.7 5.4 1.8 3.2-.1 3.9-2.7 2.8 3.1 6.5 2.6 2.3 3.1-.4 1.9 4.6 3.5 3.6 12.1.8 4.9 1h-4.3l-1.7 1.5-3.4 2.2 1.7 5.7-1.9.1-6.3-1.9-7.5-4.3-7.6-3.5-3.2-3.9-.3-3.6-4.2-4.2-5-10.6-.2-6 3.4-4.8-8.3-1.9 2.7-5.5-2-10.5 6.5 2.2-1.8-13.1-4-1.7 1 7.9-3.5-.9-1.5-9-2-11.8 1.1-4.4-3.3-6.2-2.4-7.2 2.2-.3.6-10.3 1.2-10.3.1-9.5-3.3-9.7.6-5.3-2.1-7.9 1.8-7.8-.9-12.4v-13.4l.1-14.3-1.5-10.5-2.1-9.1 2.8-1.6 1.1-3.3 3.2 4.4 1.2 4.6 3.2 2.7-1.1 6.2 3.7 7.2 3.1 8.9 3.9-.9Z"
//       className="Chile"
//     />
//     <Path d="m1016.5 177.1-2.8-1.5-3.1-2.7-4.5 1.3-3.6-.5 2.5-1.7 4-9 6.5-2.6 4 .2.9 2.1-.9 5.6-1.2 2.3h-2.9l1.1 6.5zM946.9 263.7l-2.2 1.6-2.8-.9-2.7.7.9-5-.3-3.9-2.4-.6-1.1-2.4.5-4.2 2.2-2.3.5-2.6 1.2-3.8v-2.7l-.9-2.3-.2-2.2 1.9-1.6 2.2-.9 1.2 3.1h3l.9-.8 3.1.2 1.3 3.2-2.4 1.7-.3 5-.8.9-.3 3.1-2.3.5 2 3.8-1.6 4.2 1.8 1.9-.8 1.7-2 2.4.4 2.2z" />
//     <Path
//       d="m1689.5 177.4 13.7 11-8.9-2 3.7 9 9.6 6.4 3 4.4-6.5-3.8.1 4.9-4.7-5.3-3.8-6.1-5.6-6.7-2.4-4.8-6.4-8.2-8-6.1-6.8-8.4 1.9-2.8-4.4-2.8 1.3-.9 4.9 4 6.9 5.9 5.2 6.1 7.2 6.2ZM1094.6 155.4l-8.8.1-5.9-.7.7-2.6 6.3-2 5.1 1.1 2.2.9-.2 1.7.6 1.5ZM1548.4 48.2l-5.9.1-8.9-.6-1-.3.7-2 4.2-.5 8.4 2 2.5 1.3ZM1561 38.7l-1.1 2-6.9-.4-10.3-2-1.8-1.6 8.3.7 11.8 1.3ZM1535.5 36.3l3.1 3.8-14.3-.2-4.6 1.2-12.5-3.3-3.4-3.4 3.5-.9 10.2.2 18 2.6ZM1218.8 61.3l-2.2.4-13.5-.7-2.3-2.3-7.9-1.4-2-2.9 3.5-1.1-1.6-2.8 5.4-4.4-4-.6 6.7-4.5-2.5-2.3 6.8-2.6 10.3-3.2 11.7-.9 5-1.8 6.7-.6 4.2 1.9-1.3 1.5-11.4 2.5-9.9 2.3-8.7 4.8-2.8 5-3.3 5 3.1 4.3 10 4.4Z"
//       className="Russian Federation"
//     />
//     <Path
//       d="m1661.7 231-1.4-1.1-1.9-3.3 2.5-.1-3.9-7.5-4.7-5.4 2.9-2.2 6.9 1.1-.6-6.2-2.8-6.8.3-2.3-1.3-5.7-6.9 1.9-2.6 2.4h-7.6l-6-5.8-9-4.5-10-2-6.2-6-4.5-3.8-3.8-2.7-7.7-6.2-6-2.2-8.6-1.9-6.2.2-5.1 1.1-1.7 3.1 3.7 1.4 2.5 3.4-1.3 2 .2 6.5 1.9 2.8-4.4 3.9-7.4-2.4-5.6.6-3.9-2.1-3.4-.7-4.4 4.4-5.9 1-3.6 1.6-6.8-1h-4.6l-4.9-3.2-6.6-2.9-5.4-.9-5.7.8-4 1.2-8.5-2.6-3.6-4.6-6.7-1.6-4.8-.8-7-2.5-1.3 6.4 4 3.6-2.4 4.4-8-1.6-5-.2-4.8-2.9-5.2-.1-5.3-1.9-5.9 2.9-6.7 5.3-4.7 1.1-1.7.5-4.4-3.8-6 .9-3.3-2.7-4-1.2-4.1-3.6-3.3-1.1-6.2 1.6-8.4-3.5-1.1 3.2-18.3-15.6-8.4-4.7.8-2-9.2 5.8-4.4.3-1.1-3.3-7.1-2.1-4.3 1.5-4.4-6.3-9.1-1.3-3.1 2.5-10.9 2.3-1.7 1.5-17 2.1-1.4 2.1 5.1 4.2-4 1.6 1.5 1.6-3.5 3 9.4 4.3-.2 2.9-7-.3-.8 1.9-7.3-3.2-7.7.1-4.4 2.6-6.6-2.5-12-4.3-7.6.2-8.1 6.7.6 4.5-6-3.6-2.2 6.9 1.8 1.2-1.7 4.8 5.3 4.2 3.6-.2 4.3 4.2.2 3.2 2.8 1.1-1.4 3.7-4.6 1-3.6 6.5 6 6.1.4 4.2 7.3 7.5-2.5 2.6-.6 1.6-2.4-.5-4.3-3.8-1.5-.2-3.6-1.5-2.1-2.6-5.1-1.3-2.9 1-1.2-1.2-7.6-3.1-7.7-1-4.6-1.1-.4.8-7.6-5.4-6.2-2.4-5.1-3.7 3.6-1 3.2-5.2-3.3-2.5 6.9-2.6-.4-1.4-4.3 1-.4-2.7 2.2-1.8 4.8-.4.3-2.1-1.8-3.5 1.3-3.2-.4-1.9-7.7-2-2.9.1-3.6-2.9-3.6 1-6.7-2.2-.1-1.2-2.3-2.7-3.9-.3-.8-1.9.9-1.3-3.8-3.5-4.9.6-1.5-.3-1 1.4-1.8-.2-2-4-1.5-2 .8-.6 3.9.2 1.6-1.3-1.7-1.6-3.4-1.1v-1.1l-2.1-1.1-3.8-4 .7-1.6-1.1-2.9-4.8-1.4-2.4.7-.9-1.5-5.3-1.5-2.1-3.6-1-2.9-2.5-1.3 1.6-1.9-2.4-5.6 2.6-3.4-.9-1 4.5-3.3-5.4-2.8 8-7.4 3.4-3.4.9-2.9-7.4-3.9.9-3.8-4.9-4.2 1.7-4.8-6.5-6.3 2.9-4.2-7.3-3.7-.4-3.8 3.2-.5 6.4-2.1 3.7-1.9 7.7 3.2 11.7 1.3 17.7 6.2 4.1 2.6 1.5 3.7-3.7 2.9-6.5 1.5-20.2-4.2-2.9.7 8.1 4.1 1 2.6 1.9 5.8 6.1 1.7 3.8 1.5-.2-2.8-3.4-2.4 2.1-2.2 11.6 3.6 3.2-1.4-4.3-4.2 8.1-5.4 4.1.3 4.6 1.9 1.1-3.8-4.7-3.3.8-3.3-4.3-3.4 12.3 1.8 3.6 3-5.1.7 1.2 3.1 4.1 1.9 6-1.2-.4-3.5 7.7-2.7 12.4-4.6 3.2.2-2.5 3.3 5.4.6 2.1-1.9 7.7-.1 5-2.3 6.4 3.3 2.8-3.6-6-3.1 1.2-1.8 13 1.6 6.6 1.7 18.6 6.2 1.1-2.8-5.9-2.9-.8-1.1-5.3-.6-.2-2.5-4.7-4.2-1.1-1.7 4.3-4.7-.6-4.8 2.2-1 11.4 1.4 2.9 2.9-.9 4.2 3.7 1.7 3.8 3.7 3.8 7.4 6.7 3.3.5 3.7-3.5 7.8 5.3.8.5-2 3.8-1.4-.5-2.7 1.9-2.7-4.4-3.1-.4-3.6-4.8-.4-2.9-3-.4-5.4-8.2-4.3 4.7-3.5-3.7-3.7 1.9-.1 4.2 2.8 2.1 5.1 5 1-4.6-3.8 5.1-2.1 8.1-.3 9.6 3-6.9-4.3-4.9-5.5 5.9-1 9.5.2 7.8-.7-5.6-2.6 1.3-3.3 4.2-.2 4.9-2.4 9.3-.7-.2-1.4 9.3-.4 4.3 1.1 5.4-2.6 7 .1-1.5-2.2.9-2 6.2-2 8.3 1.6-3.5 1.2 9.4.7 4.1 2.4 1.9-1.2 10.9.1 11.6 2.4 5.5 1.8 2.5 2.6-2.4 1.5-6.6 2.8-1.1 1.5 5.6.7 7.2 1.3 2.4-1 5.8 3.3.2-1.3 5.2-.8 13.6.8 3.8 2.4 17.4.8-4.8-3.9 9.5.9 6.1-.1 9.9 2.7 6 3.3.4 2.2 10.1 4.2 9 2.1-3-5.5 9.4 2.3 5-1.4 9.8 1.6 1-1.4 7.6.7-9.4-4.9 2.1-2.2 40.4 3.4 7.9 3.1 16.3 4 14.8-1 9.3.9 6.6 2.2 5.1 3.9 7.3 1.5 3.9-1.1 7-.1 9.3 1 6.9-.6 14.3 4.8 2.5-1.7-8.5-3.4-1.8-2.4 15.3 1.5 8-.3 15.8 2.5 9.5 2.4 33.2 22.1-2 2.5-6.2-.4 8.2 3 9.1 4.7 4.2 1.5 3.8 2.4 1 1.5-10-1.2-6.6 4.3-3 .7-1.6 4.1-2 3.6 1.7 2.7-11.5-4.1-6.1 4.6-4.7-2.2-1.4 2.6-7-.9 3.1 3.9 1.1 5.8 2.9 2.4 6.8 1.3 9.1 8.7-4.1.3 3.4 5 4.7 2.6-5 3.1 5.4 7-5.7 1.5 4.5 6.2-1.7 5.8-5.7-4.3-10.5-8.9-16.2-13.6-6.5-8.3.1-3.6-2.8-2.8 5.7-1.3-.2-7.5.7-6 2.5-4.7-6.6-8.2-4.7.5 3.2 4.8-3.6 6.4-12.3-7.2-9.1 2v9.8l7.7 3.6-8.5 1.6-6.4.6-4.3-4.3-8-.9-2.5 2.9-15.1-1-13.2 1.7-3.5 11.7-5 14.2 8.2.8 5.7 3.8 5.8 1.3.4-3 5.6.4 12.8 6.7 4.7 5.2 1.4 6.2 5.5 7.4 5.3 9.9-1 9.1 1.3 4.3-2 7.4-2.1 7.3-.9 3.7-4.6 3.7-3.1.1-5.2-3.1-4.1 4.7.5 2.1ZM1367.1 23.1l-18.1 1.8-1.3-6.1 2.2-.5 3.1.3 12.6 2.6 1.5 1.9ZM1164.8 13.1l-4.3.5-2.9.4v.7l-3.6.7-4.5-1 1.1-1.4-7.8-.1 6.3-.8h5.2l1.5 1.1 1.3-1 2.8-.7 5.8.9-.9.7ZM1345.1 20.4l-7.1.6-11.7-1.3-8.1-1.7-6.6-3.2-5.9-.8 5.4-2.9 6.2-.9 9.6 2 13.7 4.2 4.5 4Z"
//       className="Russian Federation"
//     />
//     <Path d="m976.6 223.4 2 2.4 9.5 2.9 1.9-1.4 5.8 2.9 5.9-.8.4 3.7-4.9 4.2-6.6 1.4-.5 2.1-3.2 3.5-2 5.2 2 3.7-3 2.8-1.2 4.2-4 1.3-3.7 4.9-6.8.1-5-.1-3.4 2.2-2.1 2.4-2.6-.5-1.9-2.2-1.4-3.6-4.9-1-.4-2.2 2-2.4.8-1.7-1.8-1.9 1.6-4.2-2-3.8 2.3-.5.3-3.1.8-.9.3-5 2.4-1.7-1.3-3.2-3.1-.2-.9.8h-3l-1.2-3.1-2.2.9-1.9 1.6.5-4.5-2-2.7 7.4-4.6 6.2 1.1h6.9l5.4 1.1 4.3-.4 8.3.3z" />
//     <Path
//       d="m1035.7 231.4-1.5 4.9-2.4-1.3-1.3-4.2.9-2.4 3.2-2.4 1.1 5.4ZM1014.4 185l1.1.5 1.4-.1 2.4 1.6 7.2 1.2-2.4 4.2-.4 4.5-1.3 1.1-2.3-.6.2 1.6-3.6 3.5v2.9l2.4-1 1.8 2.7-.1 1.8 1.5 2.4-1.7 1.9 1.5 4.9 2.8.8-.5 2.7-4.5 3.6-10.2-1.7-7.4 2.1-.6 3.8-5.9.8-5.8-2.9-1.9 1.4-9.5-2.9-2-2.4 2.7-3.8 1-12.6-5.1-6.6-3.7-3.2-7.6-2.4-.4-4.6 6.5-1.3 8.3 1.6-1.5-7.1 4.7 2.7 11.4-4.8 1.5-5.1 4.2-1.3.8 2.2 2.2.1 2.4 2.5 3.5 2.9 2.5-.5 4.4 2.9Z"
//       className="France"
//     />
//     <Path
//       d="m118.8 379.3-1.1 1.1-1.2-.9.6-1.8-.4-2.4.5-.7 1.2-1-.1-1.3.4-.6.4.1 1.9 1.1.9.6.7.8.9 2.3-.2.3-2.5 1.4-2 1ZM118.1 369.3l-2 .4-.6-1.3-.5-.5v-.4l.7-.6 1.8.6 1.2 1-.6.8ZM115.1 365.9l-.3.7-3-.2.6-.8 2.7.3ZM110.4 364.9l-.4.4-.4-.1-1.9-.2-.3-1.5-.2-.2 1.7-.9.4.4 1.1 2.1ZM102 360.7l-.8.6-1.6-1.1.4-.5 1-.6 1.3.1-.3 1.5ZM539.5 194.5l-6.1 2-4.7 2.5-4.6 2.7-.5.9 5.7-1.3 2.1 2.1 4.6-1.5 4.9-2.1 5.4-2.1-3.1 3.3 2.5.8 2.5 2.4 5.1-1.4 5.1-.5.3 1.8 1.5.2 1.2.2 1.5 2.5-4.7.6h-.1l-3.7-.7-4.5 1.2-3.7.6-4.7 4.1-3 2.3.4.7 5.5-4.1h.7l-4.7 4.9-2.9 4.4-2.5 3.6-.6 3.1-.8 1.5-.6 1.7.1 3.3.3.5 1.8-.1 1.6-.7 1.4-.8 3.3-3.1 1.8-4.2-.1-3.9 1.4-2.7 2.6-3.1 2.1-2.2 2.7-1.5-.4 2.1 2.2-3.1 1.3-.6 1.7-2.4 3.8 1.3 2.8 2.4-.8 2.9-1.6 2.9-3.8 2.5-.4 1.6h1l4.3-2.7 1.6.6-.5 3.7-.7 2.6-3.7 3.5-2 2.2-2.7 2.4 2.7 1.3 2.5.4 4-.9 3.7-1.7 3-.9 4.6-1.8 5.8-3.8.1-.6.3-1.9 2.7-.8 3.9.3 4 .5 4.6-2.1.6-2.5-.2-.9 6.8-4.4 2.7-1.1 7.8-.1h9.3l1.1-1.5 1.7-.3 2.5-1 2.8-2.9 3.2-4.9 5.5-4.7 1.1 1.6 3.7-1 1.6 1.8-2.9 8.5 2.2 3.6.2 2.1-6.4 3-6 2.2-6 1.9-4 3.8-1.3 1.4-1.2 3.4.7 3.3 2.1.2.2-2.3 1.1 1.4-1 1.8-3.8 1-2.5-.1-4.2 1.1-2.3.3-3.1.3-5 1.9 8.1-1.2 1.1 1.2-7.9 1.9H601l.4-.8-2.1 1.8 1.4.3-2.5 4.6-5.3 4.9.1-1.7-1.1-.3-1.2-1.6v3.5l1 1.1-.6 2.4-2.4 2.5-4.5 5.1-.4-.2 2.9-4.4-2-2.4 1-5.4-1.9 2.8v4.1l-3.2-1 3 2-1.5 6.1 1.4.5v2.2l-1 6.4-4.6 4.7-6.1 1.9-4.4 3.8-2.8.4-3.4 2.4-1.3 2.1-6.9 4.2-3.8 3.1-3.5 3.8-1.9 4.5v4.5l.6 5.5 1.5 4.5-.5 2.8 1.3 7.4-1 4.4-.6 2.5-2 3.9-1.8.8-2.6-.8-.4-2.8-1.8-1.5-2-5.5-1.6-4.9-.4-2.5 2-4.3-.8-3.5-3.1-5.4-1.9-1-6.1 3-.9-.4-2-3-3-1.6-6.4.9-4.6-.8-4.3.5-2.5 1 .6 1.7-.7 2.6.8 1.3-1.2.8-1.8-.9-2.3 1.2-3.9-.2-3.3-3.4-4.9.8-3.6-1.5-3.5.5-5 1.5-6.1 4.7-6.1 2.8-3.7 3-1.9 2.9-1 4.5-.4 3 .6 2.2-2.2.2-3.6-1.4-3.9-2-.9-3-.2-4.5-2.4-3.6-.9-3.8-1.6-4.4-3.2-2.6-4.5.2-4.8 5-4-1.9-2.3-1.9-.4-3.6-.8-3.3-2.4-2.8-2.1-2.1-1.3-2.3h-9.4l-.8 2.7H384.7l-10.9-4.5-7-3.1.9-1.3-7.1.7-6.3.5.3-3.2-2.1-3.7-2.2-.8.1-1.8-2.9-.4-1.2-1.7-4.8-.6-.9-1.1.8-3.5-2.5-6.4-.5-8.9.9-1.5-1.3-2.1-1.5-5.4 1.8-5.2-.9-3.5 3.9-5.3 2.8-5.4 1.1-4.9 5.5-6 4-5.7 4-5.7 4.3-8.5 1.8-5.3.4-2.9 1.4-1.3 5.8 2.2-1 5.9 2.2-1.7 2.5-5.1 1.6-5.1h137.1l1.3-2.4h1.7l-.9 3.4 1 1 3.3.4 4.6 1 3.9 1.9 4.4-.8 5.4 1.7ZM275 138.6l-7 2.3-.8-1.6 2.3-2.8 6.4-2.1 3.5-.9 2.6.4v1.9l-7 2.8ZM236 122l-3.9.9-1.7-1.1-.8-1.6 5.7-1 3 .6-2.3 2.2ZM237.2 99.6l1.2 1 3.5-.5 1.6 1.5 3.3.7-1.2.7-4.9 1.2-1.7-1.3-.3-1-4.3.3-.3-.5 3.1-2.1Z"
//       className="United States"
//     />
//     <Path
//       d="M410 66.6 385.4 87l-35.6 32.7 4.2.2 2.8 1.6.5 2.6.3 3.8 7.6-3.3 6.5-1.9-.6 3.1.8 2.4 1.6 2.7-1.1 4.2-1.4 6.9 4.6 3.8-3.2 3.8-5.1 2.9-.6-2.2-2.5-2 3.3-5.2-1.6-4.9 2.7-5.6-4.1-.4-7.1-.1-3.8-1.8-3.3-6.1-3.3-1.1-5.7-2.1-6.8.5-6-2.7-2.7-2.5-6.3 1.2-3.5 4.1-2.9.4-6.6 1.2-6.2 2-6.4 1.3 3.2-3.5 8.4-5.8 6.8-1.8.4-1.4-9.4 3.2-7.4 3.9-11.2 4.2.2 2.9-9 4.2-7.7 2.5-6.6 1.9-4 2.6-10.6 3.1-4.5 2.8-8.2 2.6-2.7-.4-6.2 1.6-7 2.1-6.1 2-10 1.8.4-1.1 8.2-2.8 6.6-1.9 8.6-3.3 6.5-.6 5-2.5 10.4-3.6 2.3-1.2 5.7-2.1 5.8-4.5 6.2-3.5-7.3 1.8-.3-1.1-4.9 2.2.4-3-3.6 2.1 1.6-2.9-7.3 2.3h-2.8l3.7-3.5 3.3-2.2-.4-2.1-7.2 1.2-.6-2.8-1.3-1.4 4-3.3-.4-2.5 5.9-3.3 7.7-3.3 5.3-2.9 4.1-.4 1.8.9 7.1-2.8 2.5.5 5.6-1.8 2.5-2.6-1.1-1 6-2.2-2.8.1-6.2 1.2-2.9 1.3-1.8-1.3-6.9.7-4.6-1.4 1.2-2.3-1-3.2 9.2-2.4 13.2-2.7h3.5l-4.3 2.8 9.2-.2 1.2-3.5-2.3-2.1.8-2.8-.7-2.3-3.3-1.7 6.5-2.9 7.5-.2 8.8-2.4 4.8-2.6 7.9-2.6 4.8-.6 11.2-2.4 3.1.4 10.4-2.8 4.4 1.1-.5 2.4 3.3-1 6.3.3-1.9 1.2 4.9.9 4.9-.5 6.2 1.6 7.2.6 2.2.6 6.6-.8 4.1 1.6 3.5.7Z"
//       className="United States"
//     />
//     <Path d="m677.3 487 1.5-2.8.5-2.9 1-2.7-2.1-3.8-.3-4.4 3.1-5.5 1.9.7 4.1 1.5 5.9 5.4.8 2.6-3.4 5.9-1.8 4.7-2.2 2.5-2.7.4-.8-1.8-1.3-.2-1.7 1.7-2.5-1.3zM592.9 422l-.5-.2-.5-.5.1-.6.2.3.4.4.3.5v.1zM634.2 384.9h-.2l.3-.4h.3l-.2.3-.2.1z" />
//     <Path
//       d="m27.7 593.3-.3.4-.2.3-.2.1-.4-.3.2-.2h.3l.1-.2.5-.1ZM34.3 593.3l-.5.1-.1-.2.4-.1.2.2Z"
//       className="American Samoa"
//     />
//     <Path
//       d="m640.7 391.9.6.3-.2.3h-.2l-.7.1-.2-.1v-.5l.3-.1.1-.3h.2l.1.3ZM640.7 388.2h.2l.2.2.1.4-.1.3-.2.1-.1-.2-.3-.2v-.5l.2-.1Z"
//       className="Antigua and Barbuda"
//     />
//     <Path d="m1264.1 333.3.3.1.2-.1.4.7-.1.2.1.9v.7l-.2.4-.1-.4-.6-.8.1-.4-.2-.7v-.4l.1-.2z" />
//     <Path
//       d="m580.4 366-.4.5-.2.5-.6.3h-.5l-.1-.1-.4.2-.5.1-.6-.2-.4.1-.1-.5.3-.2.2-.3.4-.2.3-.4h.4l.3-.2.2.3.5.2.5-.2.7-1h.3v.2l-.3.9ZM580.6 364.3l-.2-.6.6-.3.3.3v.2l-.3.1-.4.3ZM581 357.8l.2-.1.5.3h.4l.4.1.3.2v.3l-.2.1-.5-.4h-.4l-.1-.1-.5.2-.5-.2v-.1l.2-.5.2.2ZM577.1 356l-.2.4v.7l-.1.4-.4.3-.2.4-.4.3-.7.3-.1.2-.2-.2.1-.2.4-.1.2-.2v-.2l.4-.1.2-.4.4-.1.3-.4-.2-.3h-.4l-.2-.2.4-.5.1-.1h.6ZM575.2 355.7l.1.1h.4l.4.2-.4.4-.1-.2h-.2l-.4-.1-.4-.2-.3-.6.3-.1.4.1.2.4ZM566 349.8l.6.7.3.2.3.5-.3-.1-.1-.2-.3-.1-.4-.4-.2-.1-.2-.4.3-.1ZM569.7 349.8l.3.6.2.5v.4l.2.2.2.7v.9l.2.3.5.2.4.6v.8l-.4-.7v-.2l-.3-.4-.6-.2.2-.2-.3-.3v-.3l.2-.3-.1-.5-.3-.4.1-.1-.3-.4-.1-.6-.2.1.1-.7ZM572.6 349.8l-.3.2-.3-.1-.1-.2.6-.2.1.3ZM564.4 347.9l-.1-.1-.3-.7h.2l.2.8ZM574.9 347.4l-.4.6h-.4l.2-.3.1-.6.4-.3.1.4v.2ZM556.4 346.2l-.3.1-.2.3-.3-.1.6-.4.2.1ZM556.6 346.9l.4.2.2-.2.1-.5.2-.1.2.6v.5l-.1.3.1.6v.3l-.4.8-.2.1-.4-.2.2-.3.4-.2-.1-.1-.6.4-.2-.2.4-.3h-.4l-.2.1-.2-.2v-.7l.1-.2-.4-.5v-.2l.4-.2.1-.3.3-.1.1-.2.6-.3.1.4-.5.4-.2.3ZM570.1 346.3l.1.5-.2-.1-.5.1-.4.1-.1-.2.3-.2.4-.3v-.2l-.4-.2-.2-.6-.1-.6-.4-.4v-.2l-.5-.5.3-.3.4.4v.5l.2.3.1.5.3.5.4.3.1.3.2.3ZM559.8 340.8l.3.2-.6.3-.3-.1-.2.2-.5-.1.2-.3.4-.2h.7ZM555.6 340.3l.4-.2.3.3-.1.2.1.2-.2.4.3.3.2.9.2.3.4.5-.2.7.1.6-.2.3-.3.1-.4.4-.3.2h-.3l-.3.2h-.3v-.4l-.3-.2.1-.6-.3.3-.2-.1-.6-.4-.3-.3-.2-.3.7-.3.5.7.1-.6-.3-.1-.1-.3.1-.3.6-.6.2-.4-.1-.1.3-.4v-.5l-.2-.7.1-.1h.3l.2.3ZM563.7 337.7l.1.2.3.4.8.7.5.1.1.1.2.4.3.4.5.4v.2l-.2.8-.1.2v.3l-.1.5-.2.3-.1.7-.1.1-.2-.6-.4-.3.1-.2.5.1.2-.2-.1-.2.1-.4.3-.4.1-.5v-.3l-.5-.4-.4-.7-.3-.2-.6-.3-.3-.3-.6-.2-.4.2.4-.9h.1ZM554.9 330.2l.5.2h.1l.7.1.2-.2.2.1h.5l.4-.2h.4l.3-.2.1.5-.1.2h-.7l-1.1.2h-.3l-1.5.4-.7.4h-.4l-.2-.1-.3-.3-.5-.6.6.3.1.2h.5l.5-.2.4-.6-.3-.1.2-.3.1-.3.3.5ZM559.2 328.9l.8.2.2-.1.4.3.9 1 .2.6.4.1.7.5v.2l-.2.5.2.7h-.4l-.5.4-.1.2-.3 1-.1.9-.2.2-.3-.2-.1-.4-.4-.1.3-.5h.2l.5-.4-.1-.4.2-.4v-.3l.2-.3v-.6l.2-.1.2-.3.1-.3-.3-.1-.5-.1-.1-.3v-.2l-.4-.2v-.3l-.3-.7-.2-.1-.3.1-.5-.1h-.3l-.6-.4h.5Z"
//       className="Bahamas"
//     />
//     <Path d="m635.2 387-.1-.3.3.1-.2.2zM637.3 294h-.3l-.1.1.1.2-.4.2-.1-.1.2-.1h.1l.1-.3.3-.1.1.1zM651.5 418l-.6-.2-.1-.5v-.8l.2-.4.2.2.2.6.5.3.1.4-.5.4z" />
//     <Path
//       d="m1233.2 581.3-.9-.1-.2-.4v-.3l.5.1.7.5-.1.2ZM1236.9 579.4l.2 1v.7l-.1.2-.2-.3-.4-.3-.1-.2-.3-.1-.6-.4.1-.1.5.2.3-.1.2-.4v-.2l.3-.1.1.1ZM1231.2 578.4l-.5-.4-.3-.1-.3-.2-.2-.6.1-.3v-.2l.2-1.2-.1-.1.2-.4.5-.1.2.3-.2 1.2.1.3.2.4.1.5.2.6-.2.3Z"
//       className="Comoros"
//     />
//     <Path
//       d="m847.8 406.5-.2.3-.2-.2v-.3l.3-.1.1.3ZM849.7 406.6l-.2.1-.4-.1-.3-.3-.1-.3.2-.4.5-.3h.4l.2.7-.1.4-.2.2ZM853.2 403.5l.2.1v.2l.2.2.4.5h.2l.2.3.2.5.2.2-.3.5-.3.1-.5-.1-.3-.1-.3-.3v-.2l-.2-.1-.1-.4.1-.2v-.3l.2-.4-.2-.5h.3ZM856.3 403.5l.3.1.1.6-.1.4-.4.2-.4-.4.2-.4-.1-.2.4-.3ZM858.3 397.8l.3-.2.5.2.1.2v.7l-.4.3-.3.2h-.3l-.5-.2v-.5l.2-.2v-.6l.1-.1.3.2ZM850.3 395l.4-.1.3.2h.4l.3.2.1.2h-.5l-.7-.3-.2.1-.3.6-.3-.6-.1-.1-.1-.4.3-.1.4.3ZM858.1 394.5l.1.1-.1.6-.2.1v-.5l-.2-.3v-.3l-.1-.3.4-.3.2.2-.1.6v.1ZM846.8 393.2l.2.3.1.3-.7.3-.3-.2-.2-.2.4-.4.5-.1ZM846 391.4l.3.1v.2l.3.3-.2.4-.6.3-.4.4-.7.1v-.6l-.2-.2v-.2l.2-.2h.2l.2-.2.7-.4h.2Z"
//       className="Cape Verde"
//     />
//     <Path d="M599 424.5h-.3l-.4-.3-.3-.1-.3-.3-.1-.2-.3-.1-.2-.4-.3-.3.1-.5.5.3.1.5.4.4.7.2.2.3.3.4-.1.1z" />
//     <Path
//       d="m532.7 377.8.3.1.2-.4.4.1h.5l.1.2-.2.2-.2-.1-.4.1-.2.1h-.7l.2-.3ZM540.8 375.3l-.7.3.2-.3h.5ZM541.4 375.4l-.1-.1.8-.3-.2.3-.5.1Z"
//       className="Cayman Islands"
//     />
//     <Path
//       d="m1168.2 276.7.1.2.3.4-.4-.1h-.3l-.4.2-.3-.3v-.3l.3-.1.2.1.5-.1ZM1166.5 277.2v.1l-.2.2-.1.6-.1.2h-.3l-.2.2-.5.2-.2.1-.6.3-.4-.1-.5.1-.3.4-.2-.3-.3.1h-.2l-.3-.3-.4.3h-.5l-.5-.2-.5-.1-.4-.3-.3-.6-.3-.3-.2-.7-.2-.3.1-.3.5.3.4-.1.2-.3.1-.3.3-.1.2.1.2-.2h.2l.1.4.5.2.1.2h.6l.6-.5.4.1.3-.2.3.1.4.2.2-.3h.3l.3.4v.6l.3-.2.3.2.1-.1.7.2Z"
//       className="Cyprus"
//     />
//     <Path d="m642 401.7.5.1.2.5v.6l-.1.8-.1.2-.2.1-.4.2.1-.4-.1-.2-.1-.7-.3-.5v-.3l.1-.3v-.3h.2l.2.2z" />
//     <Path
//       d="m697.4 836.2.4-.1v.4l-.8-.3.3-.3.2-.1-.1.4ZM696.7 834.8l.2.2.4.1.1.4-.3.1-.1-.4-.2-.2-.1-.2ZM702.9 834l.2.1-.1.4-.3-.1-.2-.3.3-.2.1.1ZM690.8 833.1v.2l.1.3-.4.1-.3-.1-.2-.2-.3-.1-.1-.4h.2l.1-.2.3-.1.2.1-.3.3.3.1.3-.3.1.3Z"
//       className="Falkland Islands"
//     />
//     <Path
//       d="m693.7 831.8-.4-.2-.5-.3-.8-.3.1-.4-.7-.1-.3-.1-.3-.4.2-.1.8.3.8.4.5.1.4.1.3-.3.1-.3.2.1.4-.2.1.2h.5v.3h.3l.9-.2.1.2h.3l.4-.1-.3-.2-.1-.3h.4l.6.2.1.4-.4.5.1.3-.2.2h-.4l-.3.8-.3.3-.3.6-.1.3-.5.3-.1-.2h-.4v.3l-.8-.1-.1.1.3.4-.1.1-.2.4h-.4l-.3.4-.3.1h-.2l-.2-.3-.4-.3v-.2h-.5l.6.4h-.4l-.5-.3-.2-.1-.4-.2-.3-.2v-.2l.7.2.6-.2-.5-.2-.1-.1h.9l.4.1.3.2v-.2l.4-.1.1-.3-.4-.2-.2-.5.1-.2h.6l.2.1.4-.1-.1-.3h-.8v.1l-.4.2h-.6l-.5-.3v-.3l.7.2.6-.2h.3l.5-.1.4.2v-.1l-.4-.1Z"
//       className="Falkland Islands"
//     />
//     <Path
//       d="M695.3 829.9h.3l.3.3-.3.1h-.3v-.4ZM694.3 829.9h-.3l-.1-.3.4.1v.2ZM692.9 829.7l.6-.1.2.3-.3.4-.2-.1-.3.1-.3-.2.3-.2.3.2.1-.2-.5-.1.1-.1ZM700.1 829.8h.6l.1-.1.5-.1.4.2.4.3.1.3v.1l-.5.1-.2-.3-.2-.1-.1.3.2.1.1.3.3-.2.2.1.1.4.3.1.1-.1.5.3.1-.4-.8-.2.1-.5.3-.2 1.5-.1.7.6.2.1v.4l-.6-.1-.5-.2-.6.2.3.2.4.1.9.1.3.1.1.2-.2.5h-.5l-.1.1-.7.1-.5.2.3.2-.9.4-.4-.1-.5.1h-.7l-.6-.2-.6-.4v.3l.3.2.6.2.3.3.2-.1.4.1.4.3-.2.1.2.5h-.2l-.3-.3-.4-.1-.5.4-.2-.3-.3-.2h-.3l-.5-.2-.2.1.2.4h.3l.2.2-.2.1.7.6-.2.1-.4-.2h-.3l-.3-.3-.3-.1-.3-.1-.1.6.5.1v.3l-.1.2-.4-.1-.1-.2-.5-.2-.1-.2h-.2l-.4-.5.3-.4v-.2l-.4-.5v-.2l.5-.2-.1-.2.5-.1-.1-.3.6-.4.6-.2.4.4v.4l.3-.1-.5-.6.1-.3-.6-.2-.4-.3.1-.2.4.2.1-.5-.7-.2.1-.3.2.1.3-.2h.3l.2-.3-.3-.3h.4l.5.2ZM695.1 829.4h.7l.2.2.2-.2.2.1.2.3-.2.1-.4-.1-.4-.2-.8-.1.1-.2.2.1ZM688.3 828.3l-.5-.1.1-.2.4.3Z"
//       className="Falkland Islands"
//     />
//     <Path
//       d="m955.6 112 .4.2h.3l.1.2v.4l.2.3-.1.2-.6-.4-.2-.4-.2-.2-.2-.3h.3ZM955.9 110.4l.8.2.2.2-.1.4-.1.1-.4-.5-.5-.1-.2-.4.3.1ZM954.62 109.04l.08.16h.3v.3h-.4l-.2.2-.6-.2-.2-.1-.2-.3.5-.1.1-.1.557.093-.257-.193.2-.8.5.1.3.5v.1l.6.2.3.5.3.2-.1.6-.5-.4-.2-.2-.2-.1-.1-.2-.2-.2h-.5l-.08-.06ZM958.3 108.4l-.2-.2.3-.2-.1.4Z"
//       className="Faeroe Islands"
//     />
//     <Path
//       d="m955.9 108.9-.4-.2-.3-.3-.1-.3.1-.1.4-.1h.3l.6.4-.1.2.1.2.6.2v.2l-.4.3-.8-.5ZM958.1 108.3l-.3.4-.3-.2h-.3l.2-.3-.1-.4.1-.1.2.4.5.2ZM957.2 108.3h-.2l-.2-.4.1-.3.2.4.1.3Z"
//       className="Faeroe Islands"
//     />
//     <Path
//       d="m1909.4 467.7-.2.3-.5-.1v-.2l.5-.4.2.4ZM1881.2 457.1h.4l.3.2.1.4-.2.1.1.2-.1.2h-.6l-.2-.2v-.2l-.2-.3v-.3l.4-.1ZM1766.5 440.5l.1.3h-.3l-.3.5-.1-.1.3-.8.4-.1-.1.2Z"
//       className="Federated States of Micronesia"
//     />
//     <Path d="m639.2 424.5-.4.3-.2-.1-.1-.5.2-.5.3-.4h.3l.1.3-.1.7-.1.2zM1800.8 415.5l-.1.4v.6l-.1.3h-.3l-.2-.3-.1-.5v-.5l.6-.5.1-.2.1-.5.2-.1.1.2.4.1-.2.5-.5.5z" />
//     <Path
//       d="M636.3 392h-.3l-.1-.2.2-.4h.2l.1.2-.1.4ZM635.6 390.5l-.1.3h-.2l-.4-.2-.2-.2.3-.4.5.4.1.1Z"
//       className="Saint Kitts and Nevis"
//     />
//     <Path d="m643.7 413.8-.2-.2-.4-.2-.1-.2v-.6l.1-.2.7-1.1.3.2v.7l-.1.8-.1.4-.2.4zM634.2 386l-.4-.1.2-.3.3-.1-.1.5zM1402.9 474.8v.2l-.2-.1.2-.2v.1zM1953.8 456l1 .4h-.2l-.8-.4z" />
//     <Path
//       d="m1063.9 271.7-.2.3-.5-.2-.5-.3v-.5l-.1-.1h.6l.4.3.2.2.1.3ZM1062.3 270.6l-.5-.1v-.2l.4-.1.4.3-.3.1Z"
//       className="Malta"
//     />
//     <Path
//       d="m1802.5 411.1-.1.1-.2-.1-.1-.2.5-.2.2.2-.3.2ZM1804 406h-.2l-.3-.6.1-.3h.3v.3l.2.2-.1.4ZM1804.5 404.4l-.2.2.1.3h-.4v-.7l.1-.2.4-.2-.1.5.1.1ZM1802.6 396.9h-.3l-.1-.2h.4v.2ZM1800.7 385.9l-.1-.2v-.5l.3-.1.2.3-.4.5ZM1799.5 381.6l-.4-.1v-.3l.2-.1.2.2v.3Z"
//       className="Northern Mariana Islands"
//     />
//     <Path d="m638.2 393.9.2.4v.3l-.2.2-.2-.1-.1-.3.3-.5z" />
//     <Path
//       d="m1307.7 630.8.4.9-.2.6-.4.4.1.3-.3.3-.5.2h-.5l-.6-.1-.1.1-.3-.3.2-.2.1-.4.1-.7.2-.4.5-.4.1-.2.2-.5.4-.3.4.1.2.6ZM1339.5 628.7l-.3-.3.4-.2.3-.1.2.1-.1.2-.5.3Z"
//       className="Mauritius"
//     />
//     <Path
//       d="m1915.2 646.9-.2.1-.2.4-.4-.2.2-.5.1-.2.3.1.2.3ZM1919.6 639.1l-.1.1.2.4h.3l.4-.2-.1.6-.2.2-.1.4-.5.3-.4-.2v-.1l-.3-.3.1-.2-.2-.2.1-.4-.1-.4h.1l.4.1.4-.1ZM1916.9 634.8l-.2.5v.4l-.2.3.3.2.2.1.1.2-.1.2.3.4h-.2l-.2.5-.2.2-.3-.1-.2-.3-.1-.2-.6-.1-.3-.5v-.2l-.1-.3h.3l.3-.2.4-.3.1-.3-.4-.2-.4.1.2-.4.3-.1.2.1.4-.3.4.3ZM1913.5 633.2l-.3.6-.1.3h.3l-.5.5-.2.2-.1-.2.3-.4.2-.5.4-.5ZM1913.5 633.2l-.2-.4h.4l.1.4h-.3ZM1899.6 630.8l.2.1.5.9.3.3.3-.1.2-.3.9.5.3.5.7.6.3.4.1.3.4.4.1.2h.2l.3.3.9.2.1.3v.4l.3.4.4.1-.3.5.1.2.4.5h.1l.4.5-.1.4.7.2.4.5h.3l.3.2.5.4-.1.3h.3l.4.5.6.4v.2l.3.1.3.3v.2l.3.6.4.4.1-.1.4.6.5.1.3.3v.4l.1.4.1.1-.2.6-.7.4-.1-.3-.3.1-.3.3-.6-.8h-.4l-.1-.2h-.2l-.2.3-.9-.9h-.2l-.4-.5.1-.8h-.7l-.3-.2-.1-.2-.2-.1h-.3v-.3l-.2-.5-.4.1-.8-.5-.1-.2v-.3l-.3.2-.6-.3-.1-.4-.4-.3-.2-.5-.5-.1.2-.2-.3-.3-.3-.1-.3-.7v-.4l-.2-.3h-.3l-.2-.6.1-.2-.7-.4-.3-.2-.4-.6.3-.2-.2-.2-.2-.3v-.5l-.5-.3v-.6l-.2-.3h.3l.1-.3-.1-.2h-.6l-.2-.3.5-.7-.3-.3.2-.1ZM1900.7 631.1l-.3-.1.1-.4.2.5ZM1898.4 628.7l-.2.2-.1-.4.2-.2.1.4Z"
//       className="New Caledonia"
//     />
//     <Path d="M1933 505.3h-.2l-.1-.3h.3v.3zM1747.7 453.1l-.2.4.1.1-.2.6.1.2-.5.2-.2-.7.3-.2-.2-.2.3-.6.3-.1.2.3z" />
//     <Path
//       d="m607.1 385.9-.3-.2.1-.2h.3l.1.1-.2.3ZM621.7 385.4h-.2l-.9.3h-.6l.2-.2.4-.2.4-.1.6.1.1.1ZM612.2 383l.6.1h.6l.3.1.6-.1.3.1.4-.1.2.1.5-.1.4.1h.3l.8.2v-.2l.6.2.1-.1.8.1.2.2h.2l.6.3.2-.1-.1.7.2.3-.9.3-.3.4-.3.6-.3.2-.3.1h-.4l-.6.1-.3.2-.7-.1-.2-.2-.5.2-.3-.3-.7.2-.9-.1-.3.1-.6.1-.2.1-.2-.2-.4-.1-.3.2-.6-.1.3-.7v-.4l.2-.4-.2-.6-.2-.1-.1-.4.4-.2.2-.1v-.5l.4-.2.5.1Z"
//       className="Puerto Rico"
//     />
//     <Path
//       d="m195.3 679.3-.1-.1-.2-.3.1-.2.3.2-.1.4ZM205.6 641.2l-.1.1-.3-.2.2-.2.2.3ZM199.4 616.5l-.2-.1.2-.6.5-.4h.3v.2l-.2.4-.6.5ZM151.7 615.5l.7.2.3.4v.3l-.2.1-.5-.1-.4-.6-.1-.2-.6.2h-.2l-.6-.1-.2-.4-.3-.5v-.3l.1-.2.5-.1h.5l.5.2.2.4.1.6.2.1ZM148.7 614l-.2.6-.5-.2.1-.3.5-.2.1.1ZM141.1 609.7l-.2.1-.2-.3.3-.1.1.3ZM139 610.1l-.3.2h-.3l-.2-.8.2-.2.7.8h-.1ZM138 608.3l.2.1v.5l-.4-.2-.1-.3.3-.1ZM166.3 605.4l-.3.1.1-.3.2.2ZM204.3 569.5h-.3v-.4l-.2-.3.4.1.1.4v.2ZM201.2 566h-.2v-.4l.2-.3.3.2-.2.2-.1.3ZM202.4 564.4v.3l-.4.1h-.6v.3l-.4-.1-.2-.2-.1-.3.7-.4h.3l.2.2.5.1ZM195.5 561.8V562.4h-.3l-.3-.4.3-.3.3.1ZM197.9 558.8l.3.1.1.1-.6.2-.1-.3.3-.1ZM194.2 558.2l.9.1.3.3v.2l-.4.3h-.8l-.1-.5-.1-.4h.2Z"
//       className="French Polynesia"
//     />
//     <Path
//       d="m1926.8 576.2.3.2-.1.4h.3v.2h-.8l-.3-.5.2-.3h.4ZM1888.5 575.6h.2l1 .8.5.3.9.7-.1.3h-.2l-.2.2-.2-.3h-.1l-.2-.2-.1-.4-.4-.1v-.3l-.3-.1-.1.1h-.2l-.9-.4-.2-.4.3-.4.3.2ZM1925.4 574.1l-.2.3-.3-.2v-.2l.3-.2.2.3ZM1923.1 570.2l.1.1h.3l-.1.4-.5.2h-.3l-.4.1-.4.6-.1-.3-.3.1-.2-.2v-.3l.5-.1v-.2l.3-.4.7.1.4-.1ZM1896.8 567.4l.3-.1.6.3.5.5.3.3h.2l.2.2h.2l.3.3.3-.1.4.1.2.2h.4l.3-.1.2.3.2.8.3.3v.5l-.2.2.1.3-.4-.2-.3.2-.3-.1-.5-.3h-.2l-.6-.2-.4-.1-.2-.3-.3-.2-.3-.1-.2-.3-.4-.2.2-.4-.1-.4v-.4l-.2-.1-.6-.2-.3.1-.1-.2.1-.3.1-.3h.2ZM1900.8 564l-.1.2v.7l-.2-.2v-.5l.3-.2ZM1897.9 562.2l.3.9.2.4v.4l.1.5-.2.3-.4-.7-.1.3-.3-.5.1-1 .1-.2v-.3l.2-.1ZM1889.5 562.4h.3l.3-.1.4.1.1-.1h1.3l.2.3.3.1.2.3h.2l.2.1.4.4v.6h.2l.4.2.1.3v.6l-.1.1-.7.2-.2.1-.4-.1-.4-.2h-.4l-.1-.2-.5-.3h-.6l-.5.1h-.5l-.5-.1-.3-.2-.3.1-.3-.4-.3-.2-.3-.8-.2-.4.2-.2-.1-.2v-.7l.1-.3.6-.3.4.2.4.5.1.3.3.2ZM1891.8 560l.5.5-.3.3-.3-.2v-.1l.1-.5Z"
//       className="Solomon Islands"
//     />
//     <Path
//       d="m1891.8 560-.2.4h-.1l-.4-.3-.3.1-.2-.1-.1-.2.3-.1.2-.2.5.1.3.3ZM1885.2 559.5l.1.2.2.1-.2.4-.4.2-.3-.4.6-.5ZM1876.7 557.7l.2.3-.1.3-.8-.4.5-.3.2.1ZM1880.1 558.5l-.3-.2.1-.3.3-.3v.5l.1.2-.2.1ZM1879.2 556.7l.2-.1h.4v.2l-.4.3.2.2v.3l-.4.4-.2.1-.3-.1-.4-.4.1-.6.3-.1.2-.4.3-.1v.3ZM1875.6 556.8l-.2.1-.2.5.4.5-.5-.2v-.2l-.1-.3-.4-.4v-.2l.4-.2.1-.3.4-.3.3.2v.4l-.2.4ZM1888.5 556.3l.2.2-.1.2-.2-.1-.6-.5.2-.4.3-.1.2.2-.1.3.1.2ZM1895 555.5l.4.8.6.8v.3l-.4.2v.8l.1.2h.2l.2.3.5.4.1.5.1.3.2.2-.2.2.3.3-.1.1.1.5-.2.2.3.3.1.5.2.5v.6l-.1.1-.3-.3-.3-.5v-.3l-.3-.4-.4-.3-.3-.3-.5-.6-.4-.3-.3-.9-.2-1-.2-.7v-.5l-.1-.4.4-.4-.1-.3-.5-.7-.1-.3.1-.1.4.1.2.1.3-.3.2.3ZM1874.3 555.2l-.2-.4-.3-.3h.4l.1.7ZM1874.2 554.2l.4.1.1.1.1.5h-.2l-.2-.4-.2-.3ZM1877.3 554.4l-.1.3h.7l.4.7v.2l.2.3.1.5-.2.2v.3l-.6-.2-.2-.2h-.3l-.4-.3-.1-.2-.1-.3.4.1-.3-.8-.1-.2-.5.1-.2.1h-.4l-.3.4-.4-.2v-.6l.2-.2h.4v-.4l.4-.6.4-.3.3-.2.4.3.2.4-.1.7.2.1ZM1871.4 554.4h-.1l-.2-.8.1-.3v-.4l.2.1.1.4v.7l-.1.3ZM1874.8 553.9l-.3.2-.1-.1h-.4l-.3-.3-.1-.3-.1-.3.1-.3.3-.4.5-.2.2.2.3.5v.6l-.1.4ZM1871.8 550.4l.4.5v.1l.7.4-.1.3-.6.7v.3l-.3.1v-.4h-.2v-.4l-.2-.4-.3-.2-.1-.3.1-.3.2-.2.2-.2h.2ZM1882.1 550.5l.3.2-.2.1-.5.1-.1-.3.2-.2.3.1Z"
//       className="Solomon Islands"
//     />
//     <Path
//       d="m1883 550.5.2-.1.5.3.3.1.2.2.3.5.3.1.3.3v.3l.5.1v.3l.3.1.3-.1.1.1.4.2.1.2.3-.1.3.1.1.3.4.3.3.3.4.3 1 1-.3.4.3.5.1.6-.3-.1-.3-.4-.7-.8-.4-.1-.5-.4-.6-.1-.1-.3-.6-.2-.5-.5h-.2l-.8-.6-.5-.3v-.2l-.4-.2-.2-.2-.2-.4-.4-.3-.1-.2v-.4l-.4-.5-.2-.1v-.3l.7.3ZM1881.5 549.9l.2.2.2-.1.3.2-.1.2-.3-.1-.3-.4ZM1877 549.3h.5l-.2.2-.3-.1v-.1ZM1881.3 549.3l-.2.5-.1-.2.3-.3ZM1878.6 549.7l-.5.1-.2-.2.3-.4.3.1.1.4ZM1866.1 548.8l.2.3-.2.2-.3-.1-.1-.1.4-.3ZM1867.6 546.9l.3.2-.1.3-.7.2-.3-.3.3-.6.2-.1.3.3ZM1869.3 546v.5l-.2-.2v-.2l.2-.1ZM1872.2 544.5l.3.1.4.5.3.2.3.1.3.3.8.4.4.5v.4l.1.6.2.2.3.3h.2l.1.4.7.3.4-.1.1.1v.3l-.3.1-.2.3-.5-.2-.8-.4h-.5l-.3-.4-.7-.4-.6-1-.6-1-.5-.3-.7-.7v-.7l.3-.2.3.1.2.2Z"
//       className="Solomon Islands"
//     />
//     <Path
//       d="M1023.9 501.3h-.2l-.2.3h-.2l-.1-.4-.2-.8v-.3l.4-.5.3-.1.3-.3.4.1.2.4.1.3-.1.4-.2.3-.3.4-.2.2ZM1028.5 491.5l-.1.3-.2.1-.3-.1v-.3l.2-.1v-.3l.2-.2.3.1-.1.5Z"
//       className="S\xE3o Tom\xE9 and Principe"
//     />
//     <Path d="M634.2 386v.1l-.4-.1v-.1l.4.1z" />
//     <Path
//       d="m1249 562.1-.3.2h-.5l-.4.2h-.4v-.2h.5l.4-.1.4-.3h.2l.1.2ZM1248.5 561.8l-.2.1h-.4v-.2l.6.1ZM1300.4 531.5l.4.4-.2.3-.2-.3-.3-.2.2-.5.1.3Z"
//       className="Seychelles"
//     />
//     <Path
//       d="M587.7 361.6h.7l.3.4h-.3l-.3-.1-.5.1-.1-.3.2-.1ZM585 361.5l.3.4.6-.1-.2.2h-.6l-.4-.2.3-.3ZM587.2 360.9v.5l-.5-.2-.1-.3.1-.1.5.1Z"
//       className="Turks and Caicos Islands"
//     />
//     <Path
//       d="m14.7 639.5-.5-.3v-.2l.3-.2.2.7ZM11.9 637.4h.3l.4.3.3.1.2-.4.3.3-.3.3.1.2-.1.2-.2-.1-.3-.3-.7-.2v-.4ZM11.1 628.8l-.2.1-.1-.5.2.1.1.3ZM15.5 621.3l-.5.3h-.2l-.1-.1.3-.5.3.1.2.2ZM1.4 602l-.1.1-.3-.1.1-.2h.3v.2Z"
//       className="Tonga"
//     />
//     <Path
//       d="m642.8 432.2-.2.5-.3.4-.2.1-.1.4.2.6-.2.1v.7l.2.3.2.2-.2.2-.1.3v.7l-.2.1-.4.2-.5.1h-.3l-.5.1-.5-.1-.4.1-.3-.1-.5.2-.4-.2h-.6l-.3.2-.3-.1.5-.2.3-.3.4-.1.4-.3.2-.3.6.1.3-.4-.2-.8.2-.4v-.7l-.3-.4-.3-.1-.4-.1-.1-.1.4-.3 1.1-.1.2-.2h1.1l.1-.1 1.2-.2h.2ZM645.2 429l-.1.5-.3.1-.4.3h-.2l-.7.4-.2-.2.3-.3.7-.5.9-.3Z"
//       className="Trinidad and Tobago"
//     />
//     <Path d="M1998.9 556.6v-.2h.1v.1l-.1.1zM642.2 417.4l-.1.1-.5-.3v-.4l.2-.3.2-.5h.4l.1.4-.1.8-.2.2zM626.1 383.4l-.4.2h-.1l-.3.2-.1-.1.1-.3.6-.1.2.1z" />
//     <Path
//       d="m624.5 387.8.3.3-1.1.2-.1-.5.7-.2.2.2ZM625.2 384l-.2.2h-.5v-.2l.3-.1.4.1ZM623.8 383.8l.4.3-.2.2-.3-.2h-.5l.2-.2.4-.1Z"
//       className="United States Virgin Islands"
//     />
//     <Path
//       d="m1931.8 631.8-.5-.2.2-.4.5-.1.2.4-.1.2-.3.1ZM1930.6 628h-.2l-.3-.1-.4-.5-.1-.4v-.4l.2-.2.1-.4.3-.1h.4l-.2.3v.5l.7.5-.3.3-.2.5ZM1930.6 622.1h.3l.1.2-.5.1.1.3.4.2.1.3-.1.4-.4.1-.4-.3h-.4l-.2-.2-.3-.2.1-.4v-.3l.2-.5.3-.4h.5l.2.1-.1.4.1.2ZM1927.6 614.5l.6-.1.1.1.2.6.2.3.1.1-.4.6-.8.2-.3-.3-.1-.5-.3-.1-.4.3-.1-.1.2-.4.4-.3.4-.5.2.1ZM1929.9 610.6l-.1-.3h.3l-.2.3ZM1928.3 608.2l.1.5v.2l.4.1.2.5h.5v.4l-.1.1-.3-.3-.3-.1-.6.2-.3-.1-.1-.2-.1-.4.2-.5.2-.3.2-.1ZM1929.2 608h-.1l-.1-.3h.2v.3ZM1929.4 606.6l-.2.2h-.6l-.3.1-.2-.2-.4-.1-.5-.4.1-.2.5-.2.4-.1.4-.3.1-.3h.2l.1.3v.6l.5.4-.1.2ZM1924.7 605.3l.2.3.6.4.7.7.1.1v.4l.2.3-.3.2-.4.4v-.2l-.3-.1h-.4l-.2.1v.2l-.4.2-.3-.1v-.7l-.1-.6.1-.6.1-.5-.2-.5-.6.3-.2-.2-.1-.3v-.3l.3-.3v-.4l.1-.3.3-.1.6.3-.1.2.2.5-.1.2.2.4ZM1924.1 602.9h-.3l-.5-.3v-.1l.2-.3.2-.1.5.1-.1.4v.3ZM1923.6 601.9l.4-.3.1.1.1.3h-.5l-.1-.1ZM1929.3 604.5l-.2-.1.1-1.2-.1-.3.1-.5.3-.8.1-.5.2.6-.1.3v1.6l-.1.6-.3.3ZM1928 601.2h-.7l-.3-.1v-.2l.9-.7.5-.2.5-.1v.2l-.3.4-.2.3-.4.4ZM1929.9 600.5v.2h-.3l.1-.3.2-1.3v-.1l.1-1.2.2.1-.1 1.3.1.3-.1.5-.2.5Z"
//       className="Vanuatu"
//     />
//     <Path
//       d="m1923.6 601.9-.9-.1-.6.3-.1.2h-.2l-.1-.6-.2-.1-.4-1 .4-.8v-.4l-.1-.2v-1.4l-.1-.3v-.5l.2-.3v-.3l.2-.3v-.2l.3-.1.1.5.2.4.2.3.1 1.3-.1.8v.1l.6-.1.3-.3.2-.8v-.2l.3-.2.3.1-.1.4v.9l.3.1v.5l-.2.1.3.4-.2.2v.5l.2.5-.1.2h-.3l-.5.4ZM1927.8 592.6l.4.3-.1.4-.3.3-.2.2h-.6v-.4l.1-.4.2-.3.5-.1ZM1928.4 590.7l-.3.2-.2.1v.2l-.2.1v-.3l-.2-.2-.1-.3.1-.4.2-.1.4-.2.1.2.1.4v.1l.1.2ZM1923.4 586.5l-.1-.1.1-.5.2.2-.2.4Z"
//       className="Vanuatu"
//     />
//     <Path
//       d="m21.9 591.3.3.1.3.1.3.2-.1.3h-1l-.3-.1-.3.1-.2-.1-.4-.2-.3.1-.3-.2-.2-.2-.6-.3.1-.4.4-.2h.9l.9.4.5.1v.3ZM17.4 588.5l.6.6.2.7-.1.3.1.3h-.3l-.3-.2-.3.2-.9.1-.3-.3-.2-.4-.2-.1-.3-.3-.5-.4-.2-.2v-.2l.4.1.3-.1.6-.2h.4l.5-.1h.3l.2.2Z"
//       className="Samoa"
//     />
//     <Path d="M602 424.6h-.2l-.1-.5.1-.3-.1-.3-.4-.1-.3-.3.1-.3 1.2.6-.1.2v.4l-.2.2v.4zM634.3 389.6l-.2.1v-.2l.1-.1.1.2zM632.8 388.7h-.1l.1-.2.1.1-.1.1zM644 406.9v.2l.4-.1-.2.5.2.2v.2l.2.2.2.9-.3.3-.1-.4-.1.1-.6-.1h-.4l-.2-.3.6-.5h-.4l-.4-.4-.1-.5-.2-.5.3-.4.4.1.5.3.2.2z" />
//     <Path
//       d="m888.4 323.4-.3.5-.4.5-.3-.4h-.4l-.2-.2.2-.3.4.1.4-.4.3-.2.2.1.1.3ZM902 321.1v.5l.2.4-.2.7.1.3-.4.4-.5.2-.2.2-.6-.2-.5-.5-.2-.4v-.6l.6-.4.1-.5v-.2l.6.1h.4l.3.1.3-.1ZM892.1 321.9h-.2l-.3-.2-.2-.3.1-.4.1-.3h.6l.5.4.1.3-.5.5h-.2ZM898.2 318.4v.2l-.6.3-.4.5-.3.2v.4l-.4.7-.1.4-.5.6-.1.2h-.2l-.6.2-.1-.1-.1-.4-.3-.4-.1-.2-.2-.3v-.3l-.4-.6.5-.3.3.2.6-.2h.4l.5-.2.5-.4v-.2l.6-.3h.6l.3-.1.1.1ZM908.4 321.2l-.3.4-.4.1-.3-.1h-.4v-.2h.3l.6-.2.4-.3.3-.3.1-.5.1-.3.2-.5.3-.4.3-.6.2-.8.2-.2.4-.1.3.3.1.5-.1.5-.1.5v.5l-.1.1-.3.7-.3.3-.6.1-.7.3-.2.2ZM888.8 316.7l.3-.1.2.3.2.5-.2.3.1.4-.6 1-.1-.1-.1-.4-.4-.9-.1-.3-.1-.2.2-.4.3-.2.3.1ZM912.9 314.7v.4l-.2.5-.7.5-.5.1-.4.5-.5-.2v-.1l.2-.4v-.4l.2-.3.3-.2h.3l.3-.3h.5l.1-.1.2-.5.2-.1.2.2-.2.4Z"
//       className="Canary Islands (Spain)"
//     />
//     <Path d="m1240.2 583.1.2.3.5.2v.3l-.2.2.1.2-.3.6.1.2-.3.1-.2-.3v-.3l.2-.2-.2-.7-.1-.1-.1-.2.3-.3zM1295 635.8h.4l.4.2.3.3v.3l.1.5.3.2.2.2.1.2-.2.6-.1.4-.2.2-.4.1h-.9l-.2-.2-.8-.4-.3-.5v-.3l-.3-.6.1-.4.2-.2.2-.4h.1l.5-.2h.5z" />
//     <Path
//       d="M643 399.9h-.3l-.2-.4.1-.2.3-.3.3.2.1.3v.2l-.3.2ZM641.2 397.3h.3V397.6l-.2.1V398.9l-.2.2-.6.3v-.2l-.2-.2-.1-.5v-.5l-.1-.5v-.3l.2-.3.3-.1.5.3.1.2ZM642.6 396.9l.4.1.5.4-1.3.3-.3.1-.4-.3.1-.6.2-.1-.1-.6.1-.2.3-.2.3.4v.4l.2.3Z"
//       className="Guadeloupe"
//     />
//     <Path
//       d="m1989.1 624.9-.3.1.1-.4.2.3ZM1981.6 623.3l.2.2.3.1v.3l-.5.2-.5-.3-.5.3h-.3l-.2.3.1.3-.4-.1-.1.2-.4-.1-.1.1-.4-.2.3-.1.2-.1.2-.2.4.1.3-.3.2-.3.5-.1.5-.3h.2ZM1982.5 623.2l-.2.1-.2-.1.2-.2.2.2ZM1988.4 617.1l.1.5-.2.6-.1-.2-.1-.4h-.2l.1-.5.2-.1.2.1ZM1985.8 615.7h-.1l-.1-.4.2-.2.4-.1v.4l-.2.2-.2.1ZM1983.6 613.2l-.1.4.3.2.1.3.3.4.3.1.1.3h.2l.1.4-.3.5.1.2.1.5-.3.2v.5h.2l.1.5-.3.3-.6.2-.1-.2-.3.1-.1.2-.3-.3-.8.3-.8.7-.3-.1-.4.2-.3-.1-.6.1-.3-.2-.9-.3-.3-.1-.6-.1-.2-.1-.5-.2-.2-1 .3-.7h.3l.3-.1.1-.5.3-.1.1-.4-.2-.2.6-.4.4-.5.1.1.6-.5h.2l.9-.4.6.2.3-.1.5-.2.6-.1.3-.3.4.3ZM1989.9 613.4l-.2.1.2-.9h.4l-.1.4-.3.4ZM1978.5 611.4l-.2.3-.5.3v-.3l.4-.4.3.1ZM1993.4 611l-.2-.2.1-.2.5-.5.3-.5-.3 1.1-.4.3ZM1994.4 606l-.4.4-.8 1.1-.3.1-.7.4-.2.6-.4.2-.2.3-.1.2.3.1.6-.3.1-.1.3-.3.2-.3.6-.3.3-.3.6-.3v.3l-.5.7-.2.1.1.6-.3.3-.3-.3h-.4l-.5.1-.4.3-.7.1h-1l.5-.5-.4-.2-.6.2-.4.2v.2l-.3.1-.2.1-.1.4-.2.3-.3-.1v-.2l-.4-.1-.4.2-.2.5-.3.2h-.3v-.7l-.2-.4.1-.2-.1-.1-.6.2v-.4l.4-.3h.1l-.1-.5.3-.1.5.3.6-.4h.2l.3-.3h.2l.3-.3v-.2l.8-.1.9-.3.3-.1.4.1.5-.2.2-.4h.2l.2-.4.4.1.1-.2.2.1 1-.5.1.3.2-.1.2.1.3-.3.5-.2.1.1-.5.4h-.2Z"
//       className="Fiji"
//     />
//     <Circle cx={997.9} cy={189.1} />
//     <Circle cx={673.5} cy={724.1} />
//     <Circle cx={1798.2} cy={719.3} />
//   </Svg>
// );

function countMatches(list1, list2) {
  // Crear un conjunto con los elementos únicos de la primera lista
  const set1 = new Set(list1);

  // Filtrar los elementos de la segunda lista que están en el conjunto de la primera lista
  const matches = list2.filter(item => set1.has(item));

  // Retornar el número de coincidencias
  return matches.length;
}

const PlayListProgressItem = ({data}) => {
  const {profile} = useAuth()

  return (
    <View style={{ alignItems: "center", width: "50%" }}>
      <ProgressChart
        data={{
          data: [countMatches(profile?.watched, data?.films)/data?.films?.length], // 70% del progreso
        }}
        width={300}
        height={100}
        strokeWidth={16}
        radius={32}
        chartConfig={{
          backgroundColor: colors.BACKGROUND_MOVIE,
          backgroundGradientFrom: colors.BACKGROUND_MOVIE,
          backgroundGradientTo: colors.BACKGROUND_MOVIE,
          decimalPlaces: 0,
          color: (opacity = 0) => `rgba(52, 168, 235, ${opacity})`,
        }}
        hideLegend={true}
      />
      <Text
        style={{
          color: "white",
          fontWeight: "500",
          fontSize: 12,
          marginBottom: 5,
        }}
      >
        {data?.name}
      </Text>
      <Text
        style={{ color: colors.WORDS_COLOR, fontWeight: "500", fontSize: 12 }}
      >
        {`${countMatches(profile?.watched, data?.films)}/${data?.films?.length}`}
      </Text>
    </View>
  );
};

const PlayListProgress = () => {
  const { profile } = useAuth();

  const playlistCollectionRef = collection(db, "playlists");

  const getPlaylist = async (playlistCollectionRef, playlistID) => {
    return getDoc(doc(playlistCollectionRef, playlistID));
  };

  const playlistQueries = useQueries({
    queries: profile?.playlists?.map((playlistId) => ({
      queryKey: ["playlist", playlistId],
      queryFn: async () => {
        return (await getPlaylist(playlistCollectionRef, playlistId)).data();
      },
      //staleTime: 5 * 60 * 1000,
    })),
  });



  const isAnyLoading = playlistQueries.some((playlist) => playlist.isLoading);

  return (
    <View style={{ width: "100%" }}>
      {/* <View style={{ width: "100%" }}>
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>
          LIST PROGRESS
        </Text>
      </View> */}
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        paddingTop: 30,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingLeft: 20,
        paddingBottom: 30
      }}
    >
      <Text
        style={{
          color: "white",
          fontWeight: "600",
          fontSize: 28,
          paddingRight: 10,
        }}
      >
        {"LIST PROGRESS".toUpperCase()}
      </Text>
    </View>
      {!isAnyLoading ? (
        <FlashList
          data={playlistQueries}
          renderItem={(playlist) => <PlayListProgressItem data = {playlist.item.data} />}
        />
      ) : null}
    </View>
  );
};

const Statistics = () => {
  const route = useRoute();
  const { userUID } = route.params;

  const [stars, setStars] = useState(false);

  // Tenemos que recabar la info de todas las películas que haya visto el usuario
  // Supuestamente si estamos en la página de perfil previamente hemos accedido a la página de usuairo, por tanto tendremos la info

  const getUserData = async () => {
    const userRef = doc(db, "users", userUID);
    const userData = await getDoc(userRef);
    return userData.data();
  };

  const { data, isLoading } = useQuery({
    // Parece que hay que dar una función asíncrona
    queryKey: ["user", userUID],
    queryFn: async () => getUserData(),
    staleTime: 5 * 60 * 1000,
  });


  const { profile, country, searchPageFilters } = useAuth();
  const getMovie = async (filmID) => {
    const request = await fetch(
      `https://api.themoviedb.org/3/movie/${filmID?.toString()}?language=en-US`,
      options
    );
    return request.json();
  };

  const movieQueries = useQueries({
    queries: (!isLoading ? data?.watched : []).map((movieId) => ({
      queryKey: ["movie", movieId],
      queryFn: () => getMovie(movieId),
      //staleTime: 5 * 60 * 1000,
    })),
  });

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZWIwNTY0NzcxYjAwYTFiMTE2NjQ5NWQzZWZmYzI3MSIsInN1YiI6IjY1MTNmMDE2Y2FkYjZiMDJiZGViYWMwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jqZeYyXUptvRW386HRXK0ih7cWHAIF52D90xJ8fb0nY",
    },
  };
  const getMovieCreditsFromFilmById = async (filmID) => {
    const request = await fetch(
      `https://api.themoviedb.org/3/movie/${filmID?.toString()}/credits?language=en-US`,
      options
    );
    if (request.status === 200) {
      const data = await request.json();
      return [data.cast, data.crew];
    }
  };

  const movieActors = useQueries({
    queries: (!isLoading ? data?.watched : []).map((movieId) => ({
      queryKey: ["movieCredits", movieId],
      queryFn: async () => getMovieCreditsFromFilmById(movieId),
      staleTime: 5 * 60 * 1000,
      enabled: !isLoading,
    })),
  });

  const actorsLoading = movieActors.some((cast) => cast.isLoading);

  function sortByCuenta(lista) {
    return lista.sort((a, b) => b[1].cuenta - a[1].cuenta);
  }

  const createTheMap = () => {
    let mapa = new Map();
    movieActors.forEach((cast) => {
      cast?.data?.[0].forEach((actor) => {
        if (mapa.has(actor.id.toString())) {
          const cuenta = mapa.get(actor.id.toString()).cuenta;
          mapa.set(actor.id.toString(), {
            actorName: actor.name,
            actorProfilePic: actor.profile_path,
            cuenta: cuenta + 1,
          });
        } else {
          mapa.set(actor.id.toString(), {
            actorName: actor.name,
            actorProfilePic: actor.profile_path,
            cuenta: 1,
          });
        }
      });
    });

    return sortByCuenta(Array.from(mapa)).slice(0, 6);
  };
  const directors = () => {
    let mapa = new Map();
    movieActors.forEach((cast) => {
      cast?.data?.[1].forEach((crewMember) => {
        if (crewMember.job === "Director") {
          if (mapa.has(crewMember.id.toString())) {
            const cuenta = mapa.get(crewMember.id.toString()).cuenta;
            mapa.set(crewMember.id.toString(), {
              actorName: crewMember.name,
              actorProfilePic: crewMember.profile_path,
              cuenta: cuenta + 1,
            });
          } else {
            mapa.set(crewMember.id.toString(), {
              actorName: crewMember.name,
              actorProfilePic: crewMember.profile_path,
              cuenta: 1,
            });
          }
        }
      });
    });

    return sortByCuenta(Array.from(mapa)).slice(0, 6);
  };

  //console.log(createTheMap(), "CREATE THE MAP");

  const getMovieDirectorFromFilmById = async (filmID) => {
    const request = await fetch(
      `https://api.themoviedb.org/3/movie/${filmID?.toString()}/credits?language=en-US`,
      options
    );
    if (request.status === 200) {
      const data = await request.json();
      return data.crew;
    }
  };

  // PROVIDERS

  // 1. Coger todas las películas (Ya tenemos todas las películas)
  // 2. Coger con un useQueries los providers de cada una de dichas películas
  // 3. En cada película coger solo los providers del país del usuario

  const getProvidersFromMovieByID = async (movieID) => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZWIwNTY0NzcxYjAwYTFiMTE2NjQ5NWQzZWZmYzI3MSIsInN1YiI6IjY1MTNmMDE2Y2FkYjZiMDJiZGViYWMwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jqZeYyXUptvRW386HRXK0ih7cWHAIF52D90xJ8fb0nY",
      },
    };

    const request = await fetch(
      `https://api.themoviedb.org/3/movie/${movieID}/watch/providers`,
      options
    );
    if (request.status === 200) {
      const data = await request.json();
      //console.log(country, "COUNTRY")
      //console.log(data.results[country]?.flatrate, "HOLA")
      return data.results[country]?.flatrate
        ? data.results[country]?.flatrate
        : null;
    }
  };

  // const variable = {"results": {"ES": {"rent": [1,3]}}}
  // console.log(variable.results["ES"]?.flatrate, "QUE PASA")

  const movieProviders = useQueries({
    queries: (!isLoading ? data?.watched : []).map((movieID) => ({
      queryKey: ["providers", movieID],
      queryFn: async () => getProvidersFromMovieByID(movieID),
      //staleTime: 5 * 60 * 1000,
      //enable: profile?.watched?.length > 0,
    })),
  });

  const isProvidersLoading = movieProviders.some(
    (movieProviders) => movieProviders.isLoading
  );

  const createListOfMyProvidersUsage = () => {
    let mapa = new Map();
    movieProviders.forEach(({ data: providers }) => {
      providers?.forEach((provider) => {
        if (
          data.providers
            .map((providerInfo) => providerInfo.provider_id)
            .includes(provider.provider_id)
        ) {
          if (mapa.has(provider.provider_id.toString())) {
            const count = mapa.get(provider.provider_id.toString()).count;
            mapa.set(provider.provider_id.toString(), {
              providerLogoPic: provider.logo_path,
              count: count + 1,
              providerName: provider.provider_name,
            });
          } else {
            mapa.set(provider.provider_id.toString(), {
              providerLogoPic: provider.logo_path,
              count: 1,
            });
          }
        }
      });
    });
    return !isProvidersLoading ? Array.from(mapa) : [];
  };

  //console.log(createListOfMyProvidersUsage(), "createListOfMyProvidersUsage()")

  // console.log(movieProviders[0].data, "MOVIE_PROVIDERS")

  function findMinMaxRuntime(movies) {
    // Filtrar las películas con runtime mayor que 0
    const validMovies = movies.filter((movie) => movie.movieRuntime > 0);

    // Si no hay películas válidas, retornar un arreglo vacío
    if (validMovies.length === 0) {
      return [];
    }

    let maxRuntimeMovie = validMovies[0];
    let minRuntimeMovie = validMovies[0];

    validMovies.forEach((movie) => {
      if (movie.movieRuntime > maxRuntimeMovie.movieRuntime) {
        maxRuntimeMovie = movie;
      }
      if (movie.movieRuntime < minRuntimeMovie.movieRuntime) {
        minRuntimeMovie = movie;
      }
    });

    return [maxRuntimeMovie, minRuntimeMovie];
  }

  const getLongestAndShortestFilms = () => {
    const runtimes = (!isLoading ? movieQueries : []).map((movie) => {
      //console.log(movie.data.runtime);
      return {
        movieName: movie.data.original_title,
        moviePic: movie.data.poster_path,
        movieRuntime: movie.data.runtime,
      };
    });
    return findMinMaxRuntime(runtimes);
  };

  function getMostFrequentYearMovies(movies) {
    // Paso 1: Crear un objeto para contar las apariciones de cada año
    const yearCount = {};

    movies.forEach((movie) => {
      const year = movie.movieYear;
      yearCount[year] = (yearCount[year] || 0) + 1;
    });

    // Paso 2: Encontrar todos los años más repetidos
    let maxCount = 0;
    let mostFrequentYears = [];

    for (const year in yearCount) {
      if (yearCount[year] > maxCount) {
        maxCount = yearCount[year];
        mostFrequentYears = [year]; // Reiniciar la lista de años más frecuentes
      } else if (yearCount[year] === maxCount) {
        mostFrequentYears.push(year); // Añadir a la lista si tiene la misma frecuencia
      }
    }

    // Paso 3: Elegir un año aleatorio de los años más repetidos
    const randomYear =
      mostFrequentYears[Math.floor(Math.random() * mostFrequentYears.length)];

    // Paso 4: Filtrar la lista para devolver solo los objetos con el año más repetido
    const moviesWithMostFrequentYear = movies.filter(
      (movie) => movie.movieYear === randomYear
    );

    // Paso 5: Devolver la lista de películas y el año en cuestión
    return [moviesWithMostFrequentYear, randomYear];
  }

  const mostWatchedYear = () => {
    const movies = (!isLoading ? movieQueries : []).map((movie) => {
      return {
        movieYear: movie?.data?.release_date?.substring(0, 4),
        moviePic: movie?.data?.poster_path,
      };
    });
    return getMostFrequentYearMovies(movies);
  };

  //console.log(mostWatchedYear());

  function convertAndSort(obj) {
    const arr = Object.entries(obj);

    arr.sort((a, b) => b[1] - a[1]);

    return arr;
  }

  const getGenres = () => {
    const genres = {};
    (!isLoading ? movieQueries : []).forEach((movie) => {
      movie.data.genres.forEach((genre) => {
        if (genres[genre.name] === undefined) {
          genres[genre.name] = 1;
        } else {
          genres[genre.name] = genres[genre.name] + 1;
        }
      });
    });
    return convertAndSort(genres);
  };
  //console.log(getGenres(), "getGenres");

  const getFilmNanoGenres = async (movieID) => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZWIwNTY0NzcxYjAwYTFiMTE2NjQ5NWQzZWZmYzI3MSIsInN1YiI6IjY1MTNmMDE2Y2FkYjZiMDJiZGViYWMwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jqZeYyXUptvRW386HRXK0ih7cWHAIF52D90xJ8fb0nY",
      },
    };

    const request = await fetch(
      `https://api.themoviedb.org/3/movie/${movieID}/keywords`,
      options
    );
    if (request.status === 200) {
      const data = await request.json();
      return data.keywords;
    }
  };

  const moviesKeywords = useQueries({
    queries: (!isLoading ? data.watched : []).map((movieID) => {
      return {
        queryKey: ["keywords", movieID],
        queryFn: async () => getFilmNanoGenres(movieID),
        staleTime: 5 * 60 * 1000,
      };
    }),
  });

  const areKeywordsLoading = moviesKeywords.some(
    (oneMoviesKeywords) => oneMoviesKeywords.isLoading
  );

  const getNanoGenres = () => {
    const genres = {};
    (!areKeywordsLoading ? moviesKeywords : []).forEach((movieKeywords) => {
      movieKeywords?.data?.forEach((genre) => {
        if (genres[genre.name] === undefined) {
          genres[genre.name] = 1;
        } else {
          genres[genre.name] = genres[genre.name] + 1;
        }
      });
    });
    return convertAndSort(genres);
  };

  //console.log(getNanoGenres(), "getNanoGenres")
  // if (!areKeywordsLoading){
  //   console.log(moviesKeywords[2].data, "areKeywordsLoading")
  // }

  const averageRunTime = () => {
    let average = 0;
    movieQueries.forEach((movie) => {
      average += movie.data.runtime;
    });
    return average / movieQueries.length;
  };

  const duration = () => {
    let totalDuration = 0;
    movieQueries?.forEach((film) => {
      totalDuration = totalDuration + film?.data?.runtime;
    });
    return (totalDuration / 60).toFixed(0);
  };

  const numberOfFilms = movieQueries?.length;

  const yearAverage = () => {
    let totalSum = 0;
    movieQueries?.forEach((film) => {
      totalSum = totalSum + Number(film?.data?.release_date.slice(0, 4));
    });
    return Math.round(totalSum / movieQueries.length);
  };

  const voteAverage = () => {
    let totalSum = 0;
    movieQueries?.forEach((film) => {
      totalSum = totalSum + film?.data?.vote_average;
    });
    return Math.round(totalSum / movieQueries.length);
  };

  // En el callback del some hemos de devolver un booleano, si algun elemento de la lista devuelve un true,
  // automáticamente isStillLoadingSome se hace true.

  const isStillLoadingSome = movieQueries.some((film) => !film.isFetching);

  // Cuando isLoading sea true, cargamos la información de cada película
  return (
    <ScrollView style={styles.container}>
      <></>
      {/* Foto de perfil y nombre de usuario */}
      <View style={{ alignItems: "center" }}>
        {!isLoading ? (
          <Image
            source={{ uri: data.profilePic }}
            style={{ borderRadius: 100, width: 100, height: 100 }}
          />
        ) : (
          <View
            style={{ borderRadius: 55, padding: 55, backgroundColor: "gray" }}
          />
        )}
        <View>
          {isLoading ? (
            <View
              style={{
                backgroundColor: "gray",
                width: 60,
                height: 20,
                borderRadius: 10,
              }}
            />
          ) : (
            <Text
              style={{
                color: "white",
                paddingTop: 10,
                fontWeight: "600",
                fontSize: 17,
              }}
            >{`@${data?.username}`}</Text>
          )}
        </View>
      </View>

      {/* Secciones de números interesantes */}
      <View style={{ paddingTop: 30 }}>
        <View style={{ flexDirection: "row" }}>
          <NumberOf
            isStillLoadingSome={isStillLoadingSome}
            text={"Films"}
            number={numberOfFilms}
          />
          <NumberOf
            isStillLoadingSome={isStillLoadingSome}
            text={"Hours"}
            number={duration()}
          />
          <NumberOf
            isStillLoadingSome={isStillLoadingSome}
            text={"Year average"}
            number={yearAverage()}
          />
        </View>
        <View style={{ flexDirection: "row", paddingTop: 20 }}>
          <NumberOf
            isStillLoadingSome={isStillLoadingSome}
            text={"Vote Average"}
            number={voteAverage()}
          />
          <NumberOf
            isStillLoadingSome={isStillLoadingSome}
            text={"Vote Average"}
            number={voteAverage()}
          />
        </View>

        <FavouriteYear mostWatchedYear={mostWatchedYear()} />

        <Genres genres={getGenres()} numberOfMovies={movieQueries.length} />
        <NanoGenres
          nanoGenres={getNanoGenres()}
          numberOfMovies={movieQueries.length}
        />
        {!isLoading ? (
          <View
            style={{
              width: "100%",
              backgroundColor: colors.INPUT_COLOR,
              borderRadius: 15,
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}
          >
            <Text
              style={{
                color: "white",
                paddingBottom: 20,
                fontSize: 35,
                fontWeight: "600",
              }}
            >
              ScreenTime
            </Text>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flex: 3,
                  justifyContent: "center",
                  borderRadius: 10,
                  justifyContent: "flex-start",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.WORDS_COLOR,
                    fontSize: 20,
                    fontWeight: "600",
                    paddingLeft: 4,
                  }}
                >
                  Longest and shortest
                </Text>
                <View style={{ flexDirection: "row", flex: 1 }}>
                  <Movie movie={getLongestAndShortestFilms()[0]} />
                  <Movie movie={getLongestAndShortestFilms()[1]} />
                </View>
              </View>

              {/* DATOS NUMERICOS */}
              <View
                style={{
                  flex: 2,
                }}
              >
                {/* AVERAGE RUNTIME */}
                <View
                  style={{
                    backgroundColor: colors.WORDS_COLOR,
                    borderRadius: 10,
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.INPUT_COLOR,
                        fontSize: 22,
                        fontWeight: "800",
                      }}
                    >
                      Average runtime
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.COMMENT_COLOR,
                        fontSize: 45,
                        fontWeight: "800",
                      }}
                    >
                      {averageRunTime().toFixed(0).toString()}
                      <Text style={{ fontSize: 15 }}>min</Text>
                    </Text>
                  </View>
                </View>
                {/* SEPARADOR */}
                <View style={{ height: 5 }} />
                {/* TOTAL SCREEN TIME */}
                <View
                  style={{
                    backgroundColor: colors.WORDS_COLOR,
                    borderRadius: 10,
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.INPUT_COLOR,
                        fontSize: 22,
                        fontWeight: "800",
                      }}
                    >
                      Screentime
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.COMMENT_COLOR,
                        fontSize: 45,
                        fontWeight: "800",
                      }}
                    >
                      {duration().toString()}
                      <Text style={{ fontSize: 15 }}>h</Text>
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <></>
        )}
        {/* PROVIDERS */}
        <View
          style={{
            width: "100%",
            backgroundColor: colors.REVIEW_COLOR,
            borderRadius: 10,
            paddingVertical: 20,
            paddingHorizontal: 5,
            marginVertical: 30,
          }}
        >
          <View>
            <Text
              style={{
                color: "white",
                fontWeight: "500",
                fontSize: 31,
                fontFamily: "System",
                paddingLeft: 10,
              }}
            >
              Providers
            </Text>
          </View>
          <FlatList
            horizontal
            data={createListOfMyProvidersUsage()}
            renderItem={(provider) => <Provider provider={provider.item[1]} />}
          />
        </View>
        {/* <View style={{ width: "100%" }}>
          <SvgComponent />
        </View> */}

        <PlayListProgress />
        {/* <ContributionGraph
  values={[
    { date: "2024-11-01", count: 1 },
    { date: "2024-11-02", count: 2 },
    { date: "2024-11-03", count: 3 },
    { date: "2024-11-04", count: 4 },
    { date: "2024-11-05", count: 5 },
  ]}
  endDate={new Date("2024-11-30")}
  numDays={100}
  width={300}
  height={220}
  chartConfig={{
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  }}
/>       */}

        <MoviesByLanguageChart userWatchedMovies={profile?.watched} />
        <MoviesByYearChart userWatchedMovies={profile?.watched} />

        {/* ACTORS */}
        <Chooser
          title={"STARS"}
          options={["MOST WATCHED", "HIGHER RATED"]}
          state={stars}
          setState={setStars}
        />
        {!actorsLoading ? (
          <View style={{ width: "100%", alignItems: "center", paddingTop: 30 }}>
            <FlatList
              numColumns={2}
              data={createTheMap()}
              renderItem={(actor) => <Actor actor={actor.item[1]} />}
            />
          </View>
        ) : (
          <></>
        )}
        {/* DIRECTORS */}
        <View style={{ width: "100%", paddingTop: 30 }}>
          <Text
            style={{
              color: "white",
              fontSize: 35,
              fontWeight: "600",
              paddingBottom: 20,
            }}
          >
            DIRECTORS
          </Text>
          <View style={{ alignItems: "center", width: "100%" }}>
            <FlatList
              numColumns={2}
              data={directors()}
              renderItem={(actor) => <Actor actor={actor.item[1]} />}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_MOVIE,
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});

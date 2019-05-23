# Badplatser

<p align="center">
  <img width="200" src="https://github.com/benforsrup/WebMobileProject/blob/master/Screenshots/mapview.png?raw=true" alt="mapview"/>
</p>
The summer of 2018 was one of the hottest in modern history. Characterized by constant heat records and unmanageable forest fires, the weather also affected people’s choice of outdoor activities and had many seek out public bathing places as a refuge from the blazing climate. There are many great public swimming places in Stockholm municipality but the information about them is often lackluster or poorly presented. This project aims to solve that problem by providing an app where people can easily find available swimming places in their area, get relevant information about them such as water temperature and also an indication of its popularity as rated by other visitors. This helps inform people of new swimming places and saves them the time and effort of going there themselves to see what the current conditions are like.



## Requirements
Before start, make sure you installed:
- [Xcode](https://developer.apple.com/xcode/), [CocoaPods](https://cocoapods.org/) : iOS Dev Environment
- [Node](https://nodejs.org) and [React Native CLI](http://facebook.github.io/react-native/docs/getting-started.html): React Native Dev Environment

## Technologies
- React Native [Link](https://facebook.github.io/react-native/)
- React Native Navigation [By Wix](https://wix.github.io/react-native-navigation/#/)
- [Redux](http://redux.js.org/): A predictable state container for JavaScript apps
- [Redux-Saga](https://redux-saga.js.org/docs/api/): An alternative side effect model for Redux apps
- [ESLint](https://eslint.org/): Pluggable linting utility for JavaScript
- [Babel](http://babeljs.io/): The compiler for writing next generation JavaScript
- [React Native Elements](https://react-native-training.github.io/react-native-elements/): Cross Platform React Native UI Toolkit
- [React Native Vector Icons](https://oblador.github.io/react-native-vector-icons/): Customizable Icons for React Native
- [React Native Config](https://github.com/luggit/react-native-config): Config variables for React Native apps
- [React Native Maps](https://github.com/react-native-community/react-native-maps): React Native Mapview component for iOS + Android


## How to run?

Clone the repo and install packages.
```shell
$ git clone git@github.com:benforsrup/WebMobileProject.git
$ cd WebMobileProject
$ yarn
```

Since the project uses Firebase integration, the application requires a google-services.json file. See further details at https://firebase.google.com/docs/ios/setup.

To run the iOS Project.
```shell
$ cd ios && pod install
$ cd .. && react-native run-ios
```

## How does the application work?

The application consists of 6 main screens:
- Login screen
- Sign-Up screen
- List of user-recommended badplatser
- Map of Stockholm with badplats-markers
- Detail screen about a certain badplats
- Profile and logout screen

These are created at the start of the application, in the file ```Navigation.js```. It calls ```registerScreens(store);```, which creates a wrapper component for each screen and injects a redux store into each component, as well as registers the component as a native screen. Furthermore, ```Navigation.js``` then creates the structure of the application, which is built using the API from [React Native Navigation](https://wix.github.io/react-native-navigation/#/). The first screen that is pushed to the screen is the Authentication Screen, which checks if a user is logged in, and if so redirects to the Search Tab (```ListScreen.js```).

### The three tabs files
- #### ```ListScreen.js```

This file listens to the Firestore collection and pushes that content to the redux store. Furthermore, it creates some listviews using React Native's Flatlist API. A searchbar is created using React Native Elements.

- #### ```MapScreen.js```
Renders the map component from ```Map.js```.
- #### ```ProfileScreen.js```
Displays the number of upvotes and favorites the user has, as well as handling the user signout process.

### Other important ```.js``` files

- #### ```Map.js```
Renders the MapView with markers. For each badlocation in the Firestore, we create a MapView.Marker from the React Native Maps API, with a coordinates props. The component then handles rendering the markers in their correct coordinate. We also pass in a onPress prop in order to send that event to the MapScreen for further processing. This component also requires the user's location, using ```navigator.geolocation.getCurrentPosition```.
- #### ```BadDetailScreen.js```
Displays detailed information about the badlocation, such as coordinates, if it has been quality checked and temperature (if it's measured). This screen also displays images from the location taken from Google. 
- #### ```DetailCard.js```
A small component that is rendered on top of the MapView, in order to provide easy navigation between different locations. Pressing on this card navigates the user to ```BadDetailScreen.js```.

### Redux and Redux-Saga
The store consists of 2 reducers:
- #### user
Has a bunch of actions regarding updating the user data. For most of these actions, a respective saga is responsible for handling async actions. These include actions for adding a location to the user's favorites and upvotes. Furthermore, when a user logs in for the first time, a saga is fired that creates a document in a collection called ```users``` on Firestore.
- #### markers
Consists of actions responsible requesting and receiving badlocations. At first, a saga was to be responsible for updating the list of locations. However, we decided to use Firebase's included ```onCollectionUpdate``` instead. A possible improvement is to combine these two.
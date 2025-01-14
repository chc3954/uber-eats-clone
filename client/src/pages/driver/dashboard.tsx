import { gql, useMutation, useSubscription } from "@apollo/client";
import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import {
  CookedOrdersSubscription,
  TakeOrderMutation,
  TakeOrderMutationVariables,
} from "../../__generated__/graphql";
import { useNavigate } from "react-router-dom";

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: boolean;
}

const COOKED_ORDERS_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

const Driver: React.FC<IDriverProps> = () => <div className="text-2xl">🚘</div>;

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState<ICoords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<typeof google.maps>();

  const { data: cookedOrdersData, error } = useSubscription<CookedOrdersSubscription>(
    COOKED_ORDERS_SUBSCRIPTION
  );

  const [takeOrder] = useMutation<TakeOrderMutation, TakeOrderMutationVariables>(
    TAKE_ORDER_MUTATION,
    {
      onCompleted: (data: TakeOrderMutation) => {
        if (data.takeOrder.ok) {
          navigate(`/orders/${cookedOrdersData?.cookedOrders.id}`);
        }
      },
    }
  );

  const onTakeOrder = (orderId: number) => {
    takeOrder({
      variables: {
        input: {
          id: orderId,
        },
      },
    });
  };

  const onSuccess = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
    setPosition({ lat: latitude, lng: longitude });
  };

  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(position.lat, position.lng));
      const geoCoder = new google.maps.Geocoder();
      geoCoder.geocode(
        { location: new google.maps.LatLng(position.lat, position.lng) },
        (results, status) => {
          // console.log(results, status);
        }
      );
    }
  }, [position.lat, position.lng]);

  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id) {
      makeRoute();
    } else {
      console.log(error);
    }
  }, [cookedOrdersData]);

  const onMapLoaded = ({ map, maps }: { map: google.maps.Map; maps: typeof google.maps }) => {
    map.panTo(new google.maps.LatLng(position.lat, position.lng));
    setMap(map);
    setMaps(maps);
  };

  const makeRoute = () => {
    if (map && maps) {
      const directionsService = new maps.DirectionsService();
      const directionsRenderer = new maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(position.lat, position.lng),
          },
          destination: {
            location: new google.maps.LatLng(position.lat + 0.05, position.lng + 0.05),
          },
          travelMode: maps.TravelMode.DRIVING,
        },
        (result) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };

  return (
    <div>
      <Helmet>
        <title>Dashboard | Yuber Eats</title>
      </Helmet>
      <div className="bg-gray-800 w-full flex items-center justify-center">
        <div style={{ height: "50vh", width: "100%" }}>
          <GoogleMapReact
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={onMapLoaded}
            defaultCenter={position}
            defaultZoom={15}
            bootstrapURLKeys={{ key: "AIzaSyC6xc-NGTvmeaKIODh3e47o2vA-XX7nTns" }}>
            <Driver lat={position.lat} lng={position.lng} />
          </GoogleMapReact>
        </div>
      </div>
      {cookedOrdersData?.cookedOrders.restaurant ? (
        <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg p-5">
          <h1 className="text-center text-3xl font-semibold">New Cooked Order</h1>
          <h4 className="text-center my-3 text-2xl">Pick it up soon!</h4>
          <h4 className="text-center my-3 text-2xl font-medium">
            {cookedOrdersData.cookedOrders.restaurant?.name}
          </h4>
          <button
            onClick={() => onTakeOrder(cookedOrdersData.cookedOrders.id)}
            className="button my-5 block w-full text-center">
            Accept This Order
          </button>
        </div>
      ) : (
        <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg p-5">
          <h1 className="text-center text-3xl font-semibold">No Orders</h1>
        </div>
      )}
    </div>
  );
};

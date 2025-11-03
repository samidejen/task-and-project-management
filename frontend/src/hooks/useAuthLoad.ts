import { useEffect } from "react";
import { useGetMeQuery } from "@/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser, clearUser } from "../redux/authSlice";

export function useAuthLoad() {
  const dispatch = useAppDispatch();
  const { data, isSuccess, isError } = useGetMeQuery(undefined, {
    skip: false, // always fetch
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser({ ...data, role: data.role.toLowerCase() }));
    } else if (isError) {
      dispatch(clearUser());
    }
  }, [isSuccess, isError, data, dispatch]);
}

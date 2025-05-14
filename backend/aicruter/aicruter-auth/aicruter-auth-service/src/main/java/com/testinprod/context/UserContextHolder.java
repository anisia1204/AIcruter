package com.testinprod.context;

import org.springframework.security.core.userdetails.UserDetails;

public class UserContextHolder {

    private static final ThreadLocal<UserContext> userContext = new ThreadLocal<>();

    public static UserContext getUserContext() {
        return userContext.get();
    }

    public static void setUserContext(UserContext userContext) {
        UserContextHolder.userContext.set(userContext);
    }

    public static void clear() {
        userContext.remove();
    }

    public static class UserContext {
        private UserDetails userDetails;
        private Long userId;

        public UserContext(UserDetails userDetails, Long userId) {
            this.userDetails = userDetails;
            this.userId = userId;
        }

        public UserDetails getUserDetails() {
            return userDetails;
        }

        public Long getUserId() {
            return userId;
        }
    }

}

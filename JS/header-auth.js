document.addEventListener("DOMContentLoaded", function () {

  /* =========================================================
     AUTH / PROFILE ELEMENTS
     ========================================================= */

  const loginButton = document.getElementById("loginButton");
  const profileButton = document.getElementById("profileButton");

  const accountOverlay = document.getElementById("accountOverlay");
  const accountClose = document.getElementById("accountClose");
  const logoutButton = document.getElementById("logoutButton");

  const accountName = document.getElementById("accountName");
  const accountEmail = document.getElementById("accountEmail");


  /* =========================================================
     MOBILE MENU ELEMENTS
     ========================================================= */

  const mobileMenuButton =
    document.getElementById("mobileMenuButton");

  const header =
    document.querySelector(".top-navigation");

  const navigation =
    document.querySelector(".navigation-links");


  /* =========================================================
     AUTH / PROFILE
     ========================================================= */

  function updateHeader() {

    if (!loginButton || !profileButton) {
      return;
    }

    const token =
      localStorage.getItem("muwajeh_token") ||
      sessionStorage.getItem("muwajeh_token");

    const savedUser =
      localStorage.getItem("muwajeh_user") ||
      sessionStorage.getItem("muwajeh_user");


    if (token) {

      loginButton.hidden = true;
      profileButton.hidden = false;


      if (savedUser) {

        try {

          const user = JSON.parse(savedUser);

          if (accountName) {
            accountName.textContent =
              user.name || "---";
          }

          if (accountEmail) {
            accountEmail.textContent =
              user.email || "---";
          }

        } catch (error) {

          console.error(
            "Could not read saved user:",
            error
          );

        }

      }

    } else {

      loginButton.hidden = false;
      profileButton.hidden = true;

    }
  }


  /* =========================================================
     OPEN PROFILE POPUP
     ========================================================= */

  if (profileButton && accountOverlay) {

    profileButton.addEventListener(
      "click",
      function () {

        const token =
          localStorage.getItem("muwajeh_token") ||
          sessionStorage.getItem("muwajeh_token");

        if (!token) {
          return;
        }

        accountOverlay.hidden = false;

      }
    );

  }


  /* =========================================================
     CLOSE PROFILE POPUP
     ========================================================= */

  if (accountClose && accountOverlay) {

    accountClose.addEventListener(
      "click",
      function () {

        accountOverlay.hidden = true;

      }
    );


    accountOverlay.addEventListener(
      "click",
      function (event) {

        if (event.target === accountOverlay) {

          accountOverlay.hidden = true;

        }

      }
    );

  }


  /* =========================================================
     LOGOUT
     ========================================================= */

  if (logoutButton) {

    logoutButton.addEventListener(
      "click",
      function () {

        localStorage.removeItem(
          "muwajeh_token"
        );

        localStorage.removeItem(
          "muwajeh_user"
        );

        sessionStorage.removeItem(
          "muwajeh_token"
        );

        sessionStorage.removeItem(
          "muwajeh_user"
        );


        if (accountOverlay) {
          accountOverlay.hidden = true;
        }

        updateHeader();

      }
    );

  }


  /* =========================================================
     MOBILE HAMBURGER MENU
     ========================================================= */

  if (
    mobileMenuButton &&
    header &&
    navigation
  ) {


    /* =====================================================
       OPEN / CLOSE MENU
       ===================================================== */

    mobileMenuButton.addEventListener(
      "click",
      function (event) {

        event.preventDefault();
        event.stopPropagation();


        const isOpen =
          header.classList.toggle(
            "mobile-menu-open"
          );


        mobileMenuButton.setAttribute(
          "aria-expanded",
          isOpen ? "true" : "false"
        );


        /* =============================================
           CHANGE ICON
           ============================================= */

        const icon =
          mobileMenuButton.querySelector("i");


        if (icon) {

          if (isOpen) {

            icon.classList.remove(
              "fa-bars"
            );

            icon.classList.add(
              "fa-xmark"
            );

          } else {

            icon.classList.remove(
              "fa-xmark"
            );

            icon.classList.add(
              "fa-bars"
            );

          }

        }

      }
    );


    /* =====================================================
       CLOSE WHEN NAVIGATION LINK IS CLICKED
       ===================================================== */

    navigation
      .querySelectorAll(".nav-link")
      .forEach(function (link) {

        link.addEventListener(
          "click",
          function () {

            closeMobileMenu();

          }
        );

      });


    /* =====================================================
       CLOSE WHEN CLICKING OUTSIDE
       ===================================================== */

    document.addEventListener(
      "click",
      function (event) {

        if (
          header.classList.contains(
            "mobile-menu-open"
          ) &&
          !header.contains(event.target)
        ) {

          closeMobileMenu();

        }

      }
    );


    /* =====================================================
       CLOSE MENU FUNCTION
       ===================================================== */

    function closeMobileMenu() {

      header.classList.remove(
        "mobile-menu-open"
      );


      mobileMenuButton.setAttribute(
        "aria-expanded",
        "false"
      );


      const icon =
        mobileMenuButton.querySelector("i");


      if (icon) {

        icon.classList.remove(
          "fa-xmark"
        );

        icon.classList.add(
          "fa-bars"
        );

      }

    }


    /* =====================================================
       RESET WHEN RETURNING TO DESKTOP
       ===================================================== */

    window.addEventListener(
      "resize",
      function () {

        if (window.innerWidth > 800) {

          closeMobileMenu();

        }

      }
    );

  }


  /* =========================================================
     INITIAL STATE
     ========================================================= */

  updateHeader();

});
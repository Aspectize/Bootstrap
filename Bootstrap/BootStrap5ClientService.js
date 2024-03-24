/// <reference path="S:\Delivery\Aspectize.core\AspectizeIntellisenseLibrary.js" />

Global.BootStrap5ClientService = {

    aasService: 'BootStrap5ClientService',

    ShowModal: function (viewName, closeOnBackdropClick, closeOnEscape) {

        Aspectize.ExecuteCommand(aas.Services.Browser.UIService.ShowView(viewName));

        var view = document.getElementById(viewName);
        if (view) {
            var bsModal = new bootstrap.Modal(view, { backdrop: !!closeOnBackdropClick || 'static', keyboard: !!closeOnEscape, focus: true });

            view.addEventListener('hidden.bs.modal', function (event) {
                var uiService = Aspectize.Host.GetService('UIService');

                uiService.UnactivateView(viewName);
            });

            bsModal.show();

            document.body.style.paddingRight = '0px'; /* Pb Bootstrap ajoute 15px de padding-right sur la body à chaque création de Modal*/
        } 
    },

    CloseModal: function (viewName) {

        var view = document.getElementById(viewName);
        if (view) {
            var bsModal = bootstrap.Modal.getInstance(view);

            bsModal.hide();
            document.body.classList.remove('modal-open'); /* Pb Bootstrap ajoute 15px de padding-right sur la body à chaque création de Modal*/
            document.body.style.paddingRight = '0px';
            bsModal.dispose();

            Aspectize.ExecuteCommand(aas.Services.Browser.UIService.UnactivateView(viewName));
        }
    },

    CloseDropDown: function () {

        var dropdowns = document.querySelectorAll(".dropdown-toggle");
        for (var n = 0; n < dropdowns.length; n++) {
            var dd = bootstrap.Dropdown.getInstance(dropdowns[n]);
            if (dd) dd.hide();
        }
    }
};


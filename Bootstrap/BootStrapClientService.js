
Global.BootStrapClientService = {

    aasService: 'BootStrapClientService',
    aasPublished: true,

    StyleCheckBoxList: function () {

        var rx = /\binline\b/;
        var divs = document.querySelectorAll('.aasCheckBoxList div');

        Array.prototype.forEach.call(divs, function (div) {

            var gpClass = div.parentElement.parentElement.className;
            var inline = rx.test(gpClass);

            if (!div.className) div.className = inline ? 'checkbox-inline' : 'checkbox';
        });
    },

    StyleRadioButtons: function () {

        var rx = /\binline\b/;
        var labels = document.querySelectorAll('.aasRadioButtons label');

        Array.prototype.forEach.call(labels, function (lbl) {

            var gpClass = lbl.parentElement.parentElement.className;
            var inline = rx.test(gpClass);

            if (lbl.className.lastIndexOf('radio') === -1) lbl.className += inline ? ' radio-inline' : ' radio';
        });
    },

    DisplayValidator: function (control, message) {
        var controlName = control.name;

        if (!controlName) controlName = $(control).attr('aas-name');

        if (!controlName) {
            var controlId = $(control).attr('id');

            if (controlId) {
                var parts = controlId.split('-');
                controlName = parts[parts.length - 1];
            }
        }

        var formGroupSelector = '.form-group-' + controlName;
        var errorControlSelector = '.error-' + controlName;

        if (message) {
            $(formGroupSelector).addClass('has-error');
            $(errorControlSelector).removeClass('hidden');
        }
        else {
            $(formGroupSelector).removeClass('has-error');
            $(errorControlSelector).addClass('hidden');
        }
        $(errorControlSelector).html(message);
    },

    DisplayValidatorCommand: function (scopeInfo) {

        var invalidDatas = scopeInfo.InvalidData;

        var scopeViews = scopeInfo.Scope.Views;

        var currentViewName = '';

        for (var field in scopeViews) {
            currentViewName = field;
            break;
        }

        var retVal = true;

        var numErrors = invalidDatas.length;

        for (var i = 0; i < invalidDatas.length; i++) {
            var invalidData = invalidDatas[i];

            var control = invalidData.Control;

            var message = null;
            for (var Error in invalidData.Errors) {
                message = invalidData.Errors[Error];
                break;
            }

            this.DisplayValidator(control, message);

            if (message) {
                retVal = false;
            }
        }

        return retVal;
    },

    Navigate: function (viewName, schemaPath, id, title) {
        this.ShowView(viewName);

        this.CollapseNavBar();

        var history = Aspectize.Host.GetService('History');

        if (history) {
            history.PushState(viewName, schemaPath, id, title);
        }
    },

    CollapseNavBar: function () {
        if ($('.navbar-toggle').css('display') != 'none' && $('#mainnavbar').css('display') != 'none') {
            $(".navbar-toggle").trigger("click");
        }
    },

    Collapse: function (element) {
        $('.' + element).collapse('toggle');
    },

    CollapseDropdown: function () {
        $('.dropdown.open .dropdown-toggle').dropdown('toggle');
    },

    ActiveLiElement: function (element) {
        $('.' + element).parents('ul').siblings('ul').addBack().children('li').removeClass('active');
        $('.' + element).parent('li').addClass('active');
    },

    ShowModal: function (viewName, keyboard, backdrop, draggable) {
        if (keyboard && (typeof keyboard === 'string')) {
            keyboard = keyboard.toLowerCase() === 'true';
        }

        if (backdrop && (typeof backdrop === 'string')) {
            backdrop = backdrop.toLowerCase() === 'true';
        }

        if (keyboard == undefined) keyboard = true;
        if (backdrop == undefined) backdrop = true;

        var uiView = this.ShowView(viewName);

        if (uiView) {
            if (viewName) {
                $('#' + viewName + ' .modal').modal({
                    show: true,
                    backdrop: backdrop,
                    keyboard: keyboard
                });

                $('#' + viewName).on('shown.bs.modal', function () {
                    $('#' + viewName + ' [autofocus]:first').focus();
                });

                $('#' + viewName).on('hidden.bs.modal', function () {
                    var uiService = Aspectize.Host.GetService('UIService');

                    // TODO: 
                    uiService.UnactivateView(viewName);

                    // in case 2 modals are opened
                    if ($('.modal.in').css('display') == 'block') {
                        $('body').addClass('modal-open');
                    }
                });

                if (draggable) {
                    $('#' + viewName + " .modal-dialog").draggable({
                        handle: ".modal-header"
                    });
                }
            }
        }
    },

    CloseModal: function (viewName) {
        if (viewName) {
            $('#' + viewName + ' .modal').modal('hide');
        }
    },

    ShowView: function (viewName) {
        var uiView = Aspectize.Host.ExecuteCommand('UIService.ShowView', viewName);

        $('#' + viewName + ' [autofocus]:first').focus();

        $('[data-ride="carousel"]').each(function () {
            var $carousel = $(this)
            $carousel.carousel($carousel.data())
        })

        return uiView;
    },

    PrepareConfirmation: function (viewName, message, commandName, commandArgument) {

        var uiSvc = Aspectize.Host.GetService(aas.Services.Browser.UIService);

        uiSvc.SetContextValue('viewName', viewName);
        uiSvc.SetContextValue('commandName', commandName);
        uiSvc.SetContextValue('commandArgument', commandArgument);

        Aspectize.Host.ExecuteCommand(aas.Services.Browser.BootStrapClientService.ShowModal, viewName, false, false);

        uiSvc.SetControlProperty(viewName, 'Message', message);
    },

    CancelConfirmation: function () {

        var uiSvc = Aspectize.Host.GetService(aas.Services.Browser.UIService);
        var viewName = uiSvc.GetContextValue('viewName');

        Aspectize.Host.ExecuteCommand(aas.Services.Browser.BootStrapClientService.CloseModal, viewName);

        uiSvc.SetContextValue('viewName', null);
        uiSvc.SetContextValue('commandName', null);
        uiSvc.SetContextValue('commandArgument', null);
    },

    Confirmation: function () {
        var uiSvc = Aspectize.Host.GetService(aas.Services.Browser.UIService);

        var viewName = uiSvc.GetContextValue('viewName');

        var commandName = uiSvc.GetContextValue('commandName');
        var commandArgument = uiSvc.GetContextValue('commandArgument');

        Aspectize.Host.ExecuteCommand(commandName, commandArgument);

        Aspectize.Host.ExecuteCommand(aas.Services.Browser.BootStrapClientService.CloseModal, viewName);

        uiSvc.SetContextValue('viewName', null);
        uiSvc.SetContextValue('commandName', null);
        uiSvc.SetContextValue('commandArgument', null);

    }

};


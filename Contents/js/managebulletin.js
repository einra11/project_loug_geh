var verseGlobal = new Verse();
var eventGlobal = new Event();
var announcementGlobal = new Announcement();

$(function() {
    verseGlobal.InitVerseComponents();
    eventGlobal.InitEventComponents();
    announcementGlobal.InitAnnouncementComponents();
})

function Verse() {
    this.tblVerses = null;
    this.verseDate = null;
    this.selectedVerse = null;

    this.InitVerseComponents = function() {
        verseGlobal.GetAllVerses();

        verseGlobal.verseDate = new Pikaday({
            field: $('#txtVerseDate')[0],
            format: 'MMMM DD, YYYY',
            defaultDate: moment().toDate(),
            setDefaultDate: true
        });

        $('#btnToggleAddVerseModal').on('click', function() {
            verseGlobal.ClearFields();
        });

        $('#btnAddVerse').unbind('click').click(function() {
            var process = $(this).attr('btn-process')

            if (process == 'add') {
                verseGlobal.AddVerse();
            } else {
                verseGlobal.UpdateVerse();
            }
        });

        $('#tblVerses').on('click', '.edit-verse', function() {
            var verseID = $(this).data('verse-id');
            verseGlobal.selectedVerse = verseID;
            verseGlobal.GetVerse(verseID);
            $('#mdlAddVerse').find('.spn-header').html('Update Verse');
            $('#btnAddVerse').attr('btn-process', 'update');
            $('#btnAddVerse').html('Update');
        });

        $('#tblVerses').on('click', '.remove-verse', function() {
            var verseID = $(this).data('verse-id');

            if (confirm('Remove selected verse?')) {
                verseGlobal.RemoveVerse(verseID);
            }
        });
    }

    this.GetVerse = function(verseID) {
        $.ajax({
            url: "../content/functions/verseoftheday/getverse.php",
            type: "POST",
            dataType: "JSON",
            data: { id: verseID },
            success: function(data) {
                if (data.status == 1) {
                    $('#txtVerseTitle').val(data.dataVerse[0].verseTitle);
                    $('#txtVerseDesc').val(data.dataVerse[0].verseDesc);
                    verseGlobal.verseDate.setMoment(moment(data.dataVerse[0].verseDate));
                } else {
                    alert('Error on loading');
                }
            }
        });
    }

    this.GetAllVerses = function() {
        $.ajax({
            url: "../content/functions/verseoftheday/getallverses.php",
            type: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    $('#tblVerses').DataTable().destroy();

                    verseGlobal.tblVerses = $('#tblVerses').DataTable({
                        pageLength: 3,
                        dom: 'frtp',
                        data: data.dataVerses,
                        columns: [{
                                data: 'verseTitle',
                                width: '15%',
                                render: function(data, type, full, meta) {
                                    return '<span class="verse-title">' + data + '</span><br/><div class="nav-container mt-2"><a class="edit-verse active" data-verse-id="' + full.verseID + '" href="#" data-toggle="modal" data-target="#mdlAddVerse">Edit</a> | <a class="remove-verse active" data-verse-id="' + full.verseID + '" href="#"> Remove</a></div>';
                                }
                            },
                            {
                                data: 'verseDesc',
                                width: '60%',
                            },
                            {
                                data: 'verseDate',
                                width: '25%',
                                render: function(data, type, full, meta) {
                                    return moment(data).format('MMMM DD, YYYY');
                                }
                            }
                        ],
                        responsive: {
                            details: {
                                renderer: function(api, rowIdx, columns) {
                                    var data = $.map(columns, function(col, i) {
                                        return col.hidden ?
                                            '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                                            '<td>' + col.title + ':' + '</td> ' +
                                            '<td>' + col.data + '</td>' +
                                            '</tr>' :
                                            '';
                                    }).join('');

                                    return data ?
                                        $('<table/>').append(data) :
                                        false;
                                }
                            }
                        }
                    });

                } else {
                    alert('Verses was not loaded successfully.');
                }
            }
        });
    }

    this.AddVerse = function() {
        var title = $('#txtVerseTitle').val();
        var desc = $('#txtVerseDesc').val();
        var date = verseGlobal.verseDate.getMoment().format('YYYY-MM-DD');

        if (title.trim() != '' && desc.trim() != '') {
            if (confirm('Add new Verse of the Day?')) {
                $.ajax({
                    url: "../content/functions/verseoftheday/addverse.php",
                    type: "POST",
                    dataType: "JSON",
                    data: { title: title, desc: desc, date: date },
                    success: function(data) {
                        if (data.status == 1) {
                            alert('Verse has been added successfully.');
                            verseGlobal.GetAllVerses();
                            verseGlobal.ClearFields();
                        } else {
                            alert('Verse was not added successfully.');
                        }
                    }
                });
            }
        } else {
            alert('Please fill in all fieds.');
        }
    }

    this.UpdateVerse = function() {
        var id = verseGlobal.selectedVerse;
        var title = $('#txtVerseTitle').val();
        var desc = $('#txtVerseDesc').val();
        var date = verseGlobal.verseDate.getMoment().format('YYYY-MM-DD');

        if (id != null && title.trim() != '' && desc.trim() != '') {
            if (confirm('Update verse?')) {
                $.ajax({
                    url: "../content/functions/verseoftheday/updateverse.php",
                    type: "POST",
                    dataType: "JSON",
                    data: { id: id, title: title, desc: desc, date: date },
                    success: function(data) {
                        if (data.status == 1) {
                            alert('Verse has been updated successfully.');
                            verseGlobal.GetAllVerses();
                            verseGlobal.ClearFields();
                            verseGlobal.selectedVerse = null;
                        } else {
                            alert('Verse was not updated successfully.');
                        }
                    }
                });
            }
        } else {
            alert('Please fill in all fieds.');
        }
    }

    this.RemoveVerse = function(verseID) {
        $.ajax({
            url: "../content/functions/verseoftheday/removeverse.php",
            type: "POST",
            dataType: "JSON",
            data: { id: verseID },
            success: function(data) {
                if (data.status == 1) {
                    alert('Verse has been deleted successfully.');
                    verseGlobal.GetAllVerses();
                } else {
                    alert('Verse was not deleted successfully.');
                }
            }
        });
    }

    this.ClearFields = function() {
        $('#mdlAddVerse').modal('hide')
        $('#txtVerseTitle').val('');
        $('#txtVerseDesc').val('');
        $('#mdlAddVerse').find('.spn-header').html('Add Verse');
        $('#btnAddVerse').attr('btn-process', 'add');
        $('#btnAddVerse').html('<span class="icon">+</span>Add');
        verseGlobal.verseDate.setMoment(moment());
    }
}

function Event() {
    this.tblEvents = null;
    this.eventDate = null;
    this.selectedEvent = null;

    this.InitEventComponents = function() {
        eventGlobal.GetAllEvents();

        eventGlobal.eventDate = new Pikaday({
            field: $('#txtEventDate')[0],
            format: 'MMMM DD, YYYY',
            defaultDate: moment().toDate(),
            setDefaultDate: true
        });

        $('#btnToggleAddEventModal').on('click', function() {
            eventGlobal.ClearFields();
        });

        $('#btnAddEvent').unbind('click').click(function() {
            var process = $(this).attr('btn-process')

            if (process == 'add') {
                eventGlobal.AddEvent();
            } else {
                eventGlobal.UpdateEvent();
            }
        });

        $('#tblEvents').on('click', '.edit-event', function() {
            var eventID = $(this).data('event-id');
            eventGlobal.selectedEvent = eventID;
            eventGlobal.GetEvent(eventID);
            $('#mdlAddEvent').find('.spn-header').html('Update Event');
            $('#btnAddEvent').attr('btn-process', 'update');
            $('#btnAddEvent').html('Update');
        });

        $('#tblEvents').on('click', '.remove-event', function() {
            var eventID = $(this).data('event-id');

            if (confirm('Remove selected event?')) {
                eventGlobal.RemoveEvent(eventID);
            }
        });
    }

    this.GetEvent = function(eventID) {
        $.ajax({
            url: "../content/functions/event/getevent.php",
            type: "POST",
            dataType: "JSON",
            data: { id: eventID },
            success: function(data) {
                if (data.status == 1) {
                    $('#txtEventTitle').val(data.dataEvent[0].eventName);
                    $('#txtEventDesc').val(data.dataEvent[0].eventFullDesc);
                    eventGlobal.eventDate.setMoment(moment(data.dataEvent[0].eventDate));
                } else {
                    alert('Error on loading');
                }
            }
        });
    }

    this.GetAllEvents = function() {
        $.ajax({
            url: "../content/functions/event/getallevents.php",
            type: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    $('#tblEvents').DataTable().destroy();

                    eventGlobal.tblEvents = $('#tblEvents').DataTable({
                        pageLength: 3,
                        dom: 'frtp',
                        data: data.dataEvents,
                        columns: [{
                                data: 'eventName',
                                width: '15%',
                                render: function(data, type, full, meta) {
                                    return '<span class="event-title">' + data + '</span><br/><div class="nav-container mt-2"><a class="edit-event active" data-event-id="' + full.eventID + '" href="#" data-toggle="modal" data-target="#mdlAddEvent">Edit</a> | <a class="remove-event active" data-event-id="' + full.eventID + '" href="#"> Remove</a></div>';
                                }
                            },
                            {
                                data: 'eventFullDesc',
                                width: '60%',
                            },
                            {
                                data: 'eventDate',
                                width: '25%',
                                render: function(data, type, full, meta) {
                                    return moment(data).format('MMMM DD, YYYY');
                                }
                            }
                        ],
                        responsive: {
                            details: {
                                renderer: function(api, rowIdx, columns) {
                                    var data = $.map(columns, function(col, i) {
                                        return col.hidden ?
                                            '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                                            '<td>' + col.title + ':' + '</td> ' +
                                            '<td>' + col.data + '</td>' +
                                            '</tr>' :
                                            '';
                                    }).join('');

                                    return data ?
                                        $('<table/>').append(data) :
                                        false;
                                }
                            }
                        }
                    });

                } else {
                    alert('Events were not loaded successfully.');
                }
            }
        });
    }

    this.AddEvent = function() {
        var name = $('#txtEventTitle').val();
        var desc = $('#txtEventDesc').val();
        var date = eventGlobal.eventDate.getMoment().format('YYYY-MM-DD');

        if (name.trim() != '' && desc.trim() != '') {
            if (confirm('Add new Event?')) {
                $.ajax({
                    url: "../content/functions/event/addevent.php",
                    type: "POST",
                    dataType: "JSON",
                    data: { name: name, desc: desc, date: date },
                    success: function(data) {
                        if (data.status == 1) {
                            alert('Event has been added successfully.');
                            eventGlobal.GetAllEvents();
                            eventGlobal.ClearFields();
                        } else {
                            alert('Event was not added successfully.');
                        }
                    }
                });
            }
        } else {
            alert('Please fill in all fieds.');
        }
    }

    this.UpdateEvent = function() {
        var id = eventGlobal.selectedEvent;
        var name = $('#txtEventTitle').val();
        var desc = $('#txtEventDesc').val();
        var date = eventGlobal.eventDate.getMoment().format('YYYY-MM-DD');

        if (id != null && name.trim() != '' && desc.trim() != '') {
            if (confirm('Update event?')) {
                $.ajax({
                    url: "../content/functions/event/updateevent.php",
                    type: "POST",
                    dataType: "JSON",
                    data: { id: id, name: name, desc: desc, date: date },
                    success: function(data) {
                        if (data.status == 1) {
                            alert('Event has been updated successfully.');
                            eventGlobal.GetAllEvents();
                            eventGlobal.ClearFields();
                            eventGlobal.selectedEvent = null;
                        } else {
                            alert('Event was not updated successfully.');
                        }
                    }
                });
            }
        } else {
            alert('Please fill in all fieds.');
        }
    }

    this.RemoveEvent = function(eventID) {
        $.ajax({
            url: "../content/functions/event/removeevent.php",
            type: "POST",
            dataType: "JSON",
            data: { id: eventID },
            success: function(data) {
                if (data.status == 1) {
                    alert('Event has been deleted successfully.');
                    eventGlobal.GetAllEvents();
                } else {
                    alert('Event was not deleted successfully.');
                }
            }
        });
    }

    this.ClearFields = function() {
        $('#mdlAddEvent').modal('hide')
        $('#txtEventTitle').val('');
        $('#txtEventDesc').val('');
        $('#mdlAddEvent').find('.spn-header').html('Add Event');
        $('#btnAddEvent').attr('btn-process', 'add');
        $('#btnAddEvent').html('<span class="icon">+</span>Add');
        eventGlobal.eventDate.setMoment(moment());
    }
}

function Announcement() {
    this.tblAnnouncements = null;
    this.announcementDate = null;
    this.selectedAnnouncement = null;

    this.InitAnnouncementComponents = function() {
        announcementGlobal.GetAllAnnouncements();

        announcementGlobal.announcementDate = new Pikaday({
            field: $('#txtAnnouncementDate')[0],
            format: 'MMMM DD, YYYY',
            defaultDate: moment().toDate(),
            setDefaultDate: true
        });

        $('#btnToggleAddAnnouncementModal').on('click', function() {
            announcementGlobal.ClearFields();
        });

        $('#btnAddAnnouncement').unbind('click').click(function() {
            var process = $(this).attr('btn-process')

            if (process == 'add') {
                announcementGlobal.AddAnnouncement();
            } else {
                announcementGlobal.UpdateAnnouncement();
            }
        });

        $('#tblAnnouncements').on('click', '.edit-announcement', function() {
            var announcementID = $(this).data('announcement-id');
            announcementGlobal.selectedAnnouncement = announcementID;
            announcementGlobal.GetAnnouncement(announcementID);
            $('#mdlAddAnnouncement').find('.spn-header').html('Update Announcement');
            $('#btnAddAnnouncement').attr('btn-process', 'update');
            $('#btnAddAnnouncement').html('Update');
        });

        $('#tblAnnouncements').on('click', '.remove-announcement', function() {
            var announcementID = $(this).data('announcement-id');

            if (confirm('Remove selected announcement?')) {
                announcementGlobal.RemoveAnnouncement(announcementID);
            }
        });
    }

    this.GetAnnouncement = function(announcementID) {
        $.ajax({
            url: "../content/functions/announcement/getannouncement.php",
            type: "POST",
            dataType: "JSON",
            data: { id: announcementID },
            success: function(data) {
                if (data.status == 1) {
                    $('#txtAnnouncementTitle').val(data.dataAnnouncement[0].announcementTitle);
                    $('#txtAnnouncementDesc').val(data.dataAnnouncement[0].announcementDesc);
                    announcementGlobal.announcementDate.setMoment(moment(data.dataAnnouncement[0].announcementDate));
                } else {
                    alert('Error on loading');
                }
            }
        });
    }

    this.GetAllAnnouncements = function() {
        $.ajax({
            url: "../content/functions/announcement/getallannouncements.php",
            type: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    $('#tblAnnouncements').DataTable().destroy();

                    announcementGlobal.tblAnnouncements = $('#tblAnnouncements').DataTable({
                        pageLength: 3,
                        dom: 'frtp',
                        data: data.dataAnnouncements,
                        columns: [{
                                data: 'announcementTitle',
                                width: '15%',
                                render: function(data, type, full, meta) {
                                    return '<span class="announcement-title">' + data + '</span><br/><div class="nav-container mt-2"><a class="edit-announcement active" data-announcement-id="' + full.announcementID + '" href="#" data-toggle="modal" data-target="#mdlAddAnnouncement">Edit</a> | <a class="remove-announcement active" data-announcement-id="' + full.announcementID + '" href="#"> Remove</a></div>';
                                }
                            },
                            {
                                data: 'announcementDesc',
                                width: '60%',
                            },
                            {
                                data: 'announcementDate',
                                width: '25%',
                                render: function(data, type, full, meta) {
                                    return moment(data).format('MMMM DD, YYYY');
                                }
                            }
                        ],
                        responsive: {
                            details: {
                                renderer: function(api, rowIdx, columns) {
                                    var data = $.map(columns, function(col, i) {
                                        return col.hidden ?
                                            '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                                            '<td>' + col.title + ':' + '</td> ' +
                                            '<td>' + col.data + '</td>' +
                                            '</tr>' :
                                            '';
                                    }).join('');

                                    return data ?
                                        $('<table/>').append(data) :
                                        false;
                                }
                            }
                        }
                    });

                } else {
                    alert('Announcements was not loaded successfully.');
                }
            }
        });
    }

    this.AddAnnouncement = function() {
        var title = $('#txtAnnouncementTitle').val();
        var desc = $('#txtAnnouncementDesc').val();
        var date = announcementGlobal.announcementDate.getMoment().format('YYYY-MM-DD');

        if (title.trim() != '' && desc.trim() != '') {
            if (confirm('Add new Announcemnet?')) {
                $.ajax({
                    url: "../content/functions/announcement/addannouncement.php",
                    type: "POST",
                    dataType: "JSON",
                    data: { title: title, desc: desc, date: date },
                    success: function(data) {
                        if (data.status == 1) {
                            alert('Announcement has been added successfully.');
                            announcementGlobal.GetAllAnnouncements();
                            announcementGlobal.ClearFields();
                        } else {
                            alert('Announcement was not added successfully.');
                        }
                    }
                });
            }
        } else {
            alert('Please fill in all fieds.');
        }
    }

    this.UpdateAnnouncement = function() {
        var id = announcementGlobal.selectedAnnouncement;
        var title = $('#txtAnnouncementTitle').val();
        var desc = $('#txtAnnouncementDesc').val();
        var date = announcementGlobal.announcementDate.getMoment().format('YYYY-MM-DD');

        if (id != null && title.trim() != '' && desc.trim() != '') {
            if (confirm('Update announcement?')) {
                $.ajax({
                    url: "../content/functions/announcement/updateannouncement.php",
                    type: "POST",
                    dataType: "JSON",
                    data: { id: id, title: title, desc: desc, date: date },
                    success: function(data) {
                        if (data.status == 1) {
                            alert('Announcement has been updated successfully.');
                            announcementGlobal.GetAllAnnouncements();
                            announcementGlobal.ClearFields();
                            announcementGlobal.selectedAnnouncement = null;
                        } else {
                            alert('Announcement was not updated successfully.');
                        }
                    }
                });
            }
        } else {
            alert('Please fill in all fieds.');
        }
    }

    this.RemoveAnnouncement = function(announcementID) {
        $.ajax({
            url: "../content/functions/announcement/removeannouncement.php",
            type: "POST",
            dataType: "JSON",
            data: { id: announcementID },
            success: function(data) {
                if (data.status == 1) {
                    alert('Announcement has been deleted successfully.');
                    announcementGlobal.GetAllAnnouncements();
                } else {
                    alert('Announcement was not deleted successfully.');
                }
            }
        });
    }

    this.ClearFields = function() {
        $('#mdlAddAnnouncement').modal('hide')
        $('#txtAnnouncementTitle').val('');
        $('#txtAnnouncementDesc').val('');
        $('#mdlAddAnnouncement').find('.spn-header').html('Add Announcement');
        $('#btnAddAnnouncement').attr('btn-process', 'add');
        $('#btnAddAnnouncement').html('<span class="icon">+</span>Add');
        announcementGlobal.announcementDate.setMoment(moment());
    }
}
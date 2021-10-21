var homeVerseGlobal = new HomeVerse();
var homeEventGlobal = new HomeEvent();
var homeAnnouncementGlobal = new HomeAnnouncement();

$(function() {
    homeVerseGlobal.InitComponents();
    homeEventGlobal.InitComponents();
    homeAnnouncementGlobal.InitComponents();
})

function HomeVerse() {
    this.InitComponents = function() {
        homeVerseGlobal.GetVerseOfTheDay();
    }

    this.GetVerseOfTheDay = function() {
        $.ajax({
            url: "../content/functions/verseoftheday/getallsuppliers.php",
            type: "GET",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    if (data.dataVerse.length == 0) {
                        $('.verse-title').html('');
                        $('.verse-desc').html('No verse for the day');
                    } else {
                        $('.verse-title').html(data.dataVerse[0].verseTitle);
                        $('.verse-desc').html(data.dataVerse[0].verseDesc);
                    }

                } else {
                    console.log('Verses was not loaded successfully.');
                }
            }
        });
    }
}

function HomeEvent() {
    this.InitComponents = function() {
        homeEventGlobal.GetAllEvents();

        $('.event-rows').on('click', '.loaded-event .more', function() {
            if ($(this).closest('.loaded-event').hasClass('show-more')) {
                $(this).html('See more');
            } else {
                $(this).html('See less');
            }

            $(this).closest('.loaded-event').toggleClass('show-more');
        });
    }

    this.GetAllEvents = function() {
        $.ajax({
            url: "../content/functions/event/getallevents.php",
            type: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    var htmlString = '';

                    $.each(data.dataEvents, function(index) {
                        htmlString += '<div class="loaded-event p-3"><p class="event-title m-0">' + data.dataEvents[index].eventName;
                        htmlString += ' &nbsp;<span class="date">- <span class="event-date">' + moment(data.dataEvents[index].eventDate).format('MMMM DD, YYYY');
                        htmlString += '</span></span></p><p class="event-desc mb-2">' + data.dataEvents[index].eventFullDesc + '</p><span class="more">See more</span></div>';
                    });

                    $('.event-rows').html(htmlString);
                } else {
                    console.log('Events were not loaded successfully.');
                }
            }
        });
    }
}

function HomeAnnouncement() {
    this.InitComponents = function() {
        homeAnnouncementGlobal.GetAllAnnouncements();

        $('.announcement-rows').on('click', '.loaded-announcement .more', function() {
            if ($(this).closest('.loaded-announcement').hasClass('show-more')) {
                $(this).html('See more');
            } else {
                $(this).html('See less');
            }

            $(this).closest('.loaded-announcement').toggleClass('show-more');
        });
    }

    this.GetAllAnnouncements = function() {
        $.ajax({
            url: "../content/functions/announcement/getallannouncements.php",
            type: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    var htmlString = '';

                    $.each(data.dataAnnouncements, function(index) {
                        htmlString += '<div class="loaded-announcement p-3"><p class="announcement-title m-0">' + data.dataAnnouncements[index].announcementTitle;
                        htmlString += ' &nbsp;<span class="date">- <span class="announcement-date">' + moment(data.dataAnnouncements[index].announcementDate).format('MMMM DD, YYYY');
                        htmlString += '</span></span></p><p class="announcement-desc mb-2">' + data.dataAnnouncements[index].announcementDesc + '</p><span class="more">See more</span></div>';
                    });

                    $('.announcement-rows').html(htmlString);
                } else {
                    console.log('Announcements were not loaded successfully.');
                }
            }
        });
    }
}
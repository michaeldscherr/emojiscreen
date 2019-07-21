$(document).ready(function() {

    var displayResources = $("#emojis");

    $.ajax({
      type: "GET",
      url: "../data.json", 
      success: function(data) {

        var emojiCard = '';
        
        for (var i in data) {
          var dataYear = data[i].year || '';
          var dataType = data[i].type
            ? data[i].type.toLowerCase().replace(/ /g, '')
            : '';
          var dataGenres = data[i].genres
            ? data[i].genres.join(',').toLowerCase().replace(/ /g, '')
            : '';

          emojiCard += "<div class='emoji-card' data-type='" + dataType + "' data-year='" + dataYear + "' data-genres='" + dataGenres + "'><div class='hint-container'><i class='fas fa-question-circle'></i><p class='hint'><span class='type'>" + data[i].type + "</span></p></div><div class='emoji-images'>" + data[i].emojiImgs + "</div><div class='emoji-card-title hide-card'><h3>" + data[i].title + " (" + data[i].year + ")" + "</h3></div></div>";
        }
        
        displayResources.html(emojiCard);
        twemoji.parse(document.body);

        setFilters(data);
      }
    });


    $('#emojis').on('click', '.emoji-images', function() {
        $(this).siblings('.emoji-card-title').toggleClass("hide-card");
    });

    $('#emojis').on('mouseover', '.hint-container', function() {
        $(this).find('.hint').addClass("hint-reveal");
    });

    $('#emojis').on('mouseleave', '.hint-container', function() {
      $(this).find('.hint').removeClass("hint-reveal");
    });

    $('.js-input-filter').on('change', function(event) {
      $('.emoji-card').show();

      var target = $(event.currentTarget);
      var type = target.data('input');
      var value = target.val().toLowerCase();

      if (!value.length) {
        $('.emoji-card').show();

        return;
      }

      var filterList = $('.emoji-card')
        .not('[data-' + type + '="' + value + '"]');

      filterList.hide();
    })

    function sortAlphabetically(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();

        if (a < b) {
          return -1;
        }

        if (a > b) {
          return 1;
        }

        return 0;
    }

    function sortNumerically(a, b, sortType) {
        sortType = sortType || 'asc';

        return sortType === 'asc'
          ? a - b
          : b - a;
    }
    
    function setFilters(data) {
      var filters = getFilters(data);

      var years = (function() {
        var max = Math.max.apply(null, filters.years);
        var min = Math.min.apply(null, filters.years);

        return {
          max: max,
          min: min,
          values: filters.years.map(function(year) {
            var option = $('<option>');
    
            option.val(year).text(year);
    
            return option;
          })
        }
      })();

      var genres = filters.genres.map(function(genre) {
        var option = $('<option>');

        option.val(genre).text(genre);

        return option;
      });

      var types = filters.types.map(function(type) {
        var option = $('<option>');

        option.val(type).text(type);

        return option;
      });

      var inputYears = $('[data-input="year"]');
      var inputGenres = $('[data-input="genre"]');
      var inputTypes = $('[data-input="type"]');

      inputGenres.append(genres);
      inputTypes.append(types);
      inputYears.append(years.values);
    }

    function getFilters(data) {
      var years = data.reduce(function(resultsSet, cur) {
        if (!('year' in cur)) {
          return resultsSet;
        }

        if (resultsSet.indexOf(cur.year) === -1) {
          resultsSet.push(parseInt(cur.year, 10));
        }

        return resultsSet;
      }, []).sort(sortNumerically);

      var genres = data.reduce(function(resultsSet, cur) {
        if (!('genres' in cur)) {
          return resultsSet;
        }

        cur.genres.forEach(function(genre) {
          var normalizedValue = genre.charAt(0).toUpperCase() + genre.slice(1);

          if (resultsSet.indexOf(normalizedValue) === -1) {
            resultsSet.push(normalizedValue);
          }
        });

        return resultsSet;
      }, []).sort(sortAlphabetically);

      var types = data.reduce(function(resultsSet, cur) {
        if (!('type' in cur)) {
          return resultsSet;
        }

        var normalizedValue = cur.type.charAt(0).toUpperCase() + cur.type.slice(1);

        if (resultsSet.indexOf(normalizedValue) === -1) {
          resultsSet.push(normalizedValue);
        }

        return resultsSet;
      }, []).sort(sortAlphabetically);

      return {
        years: years,
        genres: genres,
        types: types,
      }
    };
});

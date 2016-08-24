var umamiHappyReportApp = angular.module('umamiHappyReportApp', ['ngMaterial']);

umamiHappyReportApp.controller('BoardMembersListController', function BoardMembersListController($scope) {
    $scope.changeBoard = function() {
        Trello.rest('GET', 'boards/'+$scope.currentBoard.id+'/members', function(members) {
            $scope.members = members;
            $scope.$apply();
        });
        Trello.rest('GET', 'boards/'+$scope.currentBoard.id+'/actions', function(actions) {
            $scope.actions = actions;
            $scope.updateDateRange();
            $scope.$apply();
        });
    }

    Trello.rest('GET', 'members/me/boards', function(boards) {
        $scope.boards = boards;
        $scope.currentBoard = $scope.boards[0];
        $scope.changeBoard();
        $scope.$apply();
    });

    $scope.startDate = null;
    $scope.endDate = null;

    $scope.updateDateRange = function() {
        if ($scope.startDate != null && $scope.endDate != null) {
            if ($scope.endDate <= $scope.startDate) {
                console.log('Start date: '+$scope.startDate);
                console.log('End date: '+$scope.endDate);
                $scope.endDate.setDate($scope.startDate.getDate() + 1);
                console.log('Start date: '+$scope.startDate);
                console.log('End date: '+$scope.endDate);
            }
            $scope.filteredActions = [];
            for (action in $scope.actions) {
                var actionDate = new Date($scope.actions[action].date);
                if ($scope.actions[action].data != undefined && $scope.actions[action].data.card != undefined &&
                  actionDate >= $scope.startDate && actionDate <= $scope.endDate) {
                    $scope.filteredActions.push($scope.actions[action]);
                }
            }
        } else {
            $scope.filteredActions = $scope.actions;
        }
    }
});
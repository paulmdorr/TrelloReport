var umamiHappyReportApp = angular.module('umamiHappyReportApp', ['ngMaterial']);

umamiHappyReportApp.controller('BoardMembersListController', function BoardMembersListController($scope) {
    $scope.changeBoard = function() {
        Trello.rest('GET', 'boards/'+$scope.currentBoard.id+'/members', function(members) {
            $scope.members = members;
            $scope.$apply();
        });
        Trello.rest('GET', 'boards/'+$scope.currentBoard.id+'/actions', function(actions) {
            $scope.actions = actions;
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
});
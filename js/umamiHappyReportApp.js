var umamiHappyReportApp = angular.module('umamiHappyReportApp', ['ngMaterial']);

umamiHappyReportApp.controller('BoardMembersListController', function BoardMembersListController($scope) {
    $scope.changeBoard = function() {
        Trello.rest('GET', 'boards/'+$scope.currentBoard.id+'/members', function(members) {
            $scope.members = members;
            $scope.$apply();
        });
        Trello.rest('GET', 'boards/'+$scope.currentBoard.id+'/actions', function(actions) {
            $scope.actions = actions;
            $scope.updateFilter();
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
    $scope.membersFilter = [{fullName: 'All'}];

    $scope.updateFilter = function() {
        if ($scope.startDate != null && $scope.endDate != null) {
            if ($scope.endDate <= $scope.startDate) {
                //TODO: check why it isn't working when changing start date instead of end date
                console.log('Start date: '+$scope.startDate);
                console.log('End date: '+$scope.endDate);
                $scope.endDate.setDate($scope.startDate.getDate() + 1);
                console.log('Start date: '+$scope.startDate);
                console.log('End date: '+$scope.endDate);
            }
        }

        $scope.filteredActions = [];
        for (action in $scope.actions) {
            var actionDate = new Date($scope.actions[action].date);
            var isCard = $scope.actions[action].data != undefined && $scope.actions[action].data.card != undefined;
            var withinDateRange = ($scope.startDate == null || $scope.endDate == null)
                || (actionDate >= $scope.startDate && actionDate <= $scope.endDate);
            var belongsToMember = false;

            if ($scope.membersFilter[0].fullName == 'All') {
                belongsToMember = true;
            } else {
                for (member in $scope.membersFilter) {
                    if ($scope.actions[action].memberCreator.username == $scope.membersFilter[member].username) {
                        belongsToMember = true;
                        break;
                    }
                }
            }
            
            if (isCard && withinDateRange && belongsToMember) {
                $scope.filteredActions.push($scope.actions[action]);
            }
        }
    }

    $scope.alterMembersFilter = function(member) {
        if (member != null && member.fullName != 'All') {
            $scope.members.push(member);
        }
        if ($scope.membersFilter.length == 0) {
            $scope.membersFilter = [{fullName: 'All'}];
        }
        $scope.updateFilter();
    }

    $scope.addMemberToFilter = function(member) {
        if (member != null) {
            if ($scope.membersFilter[0].fullName == 'All') {
                $scope.membersFilter = [];
            }
            $scope.membersFilter.push(member);
            $scope.members.splice($scope.members.indexOf(member), 1);
        }
        $scope.updateFilter();
    }
});
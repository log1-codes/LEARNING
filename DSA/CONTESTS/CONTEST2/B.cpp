#include <iostream>
using namespace std;

int main() {
    int N;
    cin >> N;

    long long time;
    long long minTime = 1000000000000LL; 
    int fastestID = 0;

    for (int i = 1; i <= N; i++) {
        cin >> time;

        if (time < minTime || (time == minTime && i > fastestID)) {
            minTime = time;
            fastestID = i;
        }
    }

    cout << fastestID << endl;

    return 0;
}

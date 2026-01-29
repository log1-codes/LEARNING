#include <iostream>
using namespace std;

int main() {
    long long N;
    cin >> N;

    int ans = 0;
    while (N !=0) {
       ans = (ans*10)+ N%10 ;
       N/=10;
    }

    cout << ans;
    return 0;
}
